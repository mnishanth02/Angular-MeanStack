import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Post } from "./post.model";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class PostService {
  private postsList: Post[] = [];

  private addPostSubject = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPostsList() {
    this.http
      .get<{ mesage: string; posts: any }>("http://localhost:3000/api/posts")
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              postTitle: post.postTitle,
              postContent: post.postContent,
              id: post._id,
              imagePath: post.imagePath
            };
          });
        })
      )
      .subscribe(transformedPost => {
        this.postsList = transformedPost;
        this.addPostSubject.next([...this.postsList]);
      });
  }

  getPostUpdateListener() {
    return this.addPostSubject.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      postTitle: string;
      postContent: string;
      imagePath: string
    }>("http://localhost:3000/api/posts/" + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("postTitle", title);
    postData.append("postContent", content);
    postData.append("image", image);

    this.http
      .post<{ message: string; post: Post }>(
        "http://localhost:3000/api/posts",
        postData
      )
      .subscribe(responseData => {
        // console.log('Post Message :' + finalPost.message);
        console.log("Post Message :" + responseData.message);
        const post: Post = {
          id: responseData.post.id,
          postTitle: title,
          postContent: content,
          imagePath: responseData.post.imagePath
        };

        this.postsList.push(post);
        this.addPostSubject.next([...this.postsList]);
        console.log(...this.postsList);
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("postTitle", title);
      postData.append("postContent", content);
      postData.append("image", image);
    } else {
      postData = {
        id: id,
        postTitle: title,
        postContent: content,
        imagePath: image
      };
    }
    this.http
      .put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(response => {
        const updatedPost = [...this.postsList];
        const oldPostIndex = updatedPost.findIndex(p => p.id === id);
        const post: Post = {
          id: id,
          postTitle: title,
          postContent: content,
          imagePath: ""
        };
        updatedPost[oldPostIndex] = post;
        this.postsList = updatedPost;
        this.addPostSubject.next([...this.postsList]);
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    this.http
      .delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(() => {
        const updatedPost = this.postsList.filter(post => post.id !== postId);
        this.postsList = updatedPost;
        this.addPostSubject.next([...this.postsList]);
      });
  }
}
