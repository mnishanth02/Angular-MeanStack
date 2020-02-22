import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Post } from "./post.model";
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';

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
              id: post._id
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
    }>("http://localhost:3000/api/posts/" + id);
  }

  addPost(title: string, content: string) {
    const post: Post = {
      id: null,
      postTitle: title,
      postContent: content
    };
    this.http
      .post<{ message: string; postId: string }>(
        "http://localhost:3000/api/posts",
        post
      )
      .subscribe(responseData => {
        // console.log('Post Message :' + finalPost.message);
        console.log("Post Message :" + responseData.message);
        const id = responseData.postId;
        post.id = id;
        this.postsList.push(post);
        this.addPostSubject.next([...this.postsList]);
        console.log(...this.postsList);
        this.router.navigate(["/"])
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id: id, postTitle: title, postContent: content };
    this.http
      .put("http://localhost:3000/api/posts/" + id, post)
      .subscribe(response => {
        const updatedPost = [...this.postsList];
        const oldPostIndex = updatedPost.findIndex(p => p.id === post.id);
        updatedPost[oldPostIndex] = post;
        this.postsList = updatedPost;
        this.addPostSubject.next([...this.postsList]);
        this.router.navigate(["/"])
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
