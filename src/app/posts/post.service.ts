import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Post } from "./post.model";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class PostService {
  private postsList: Post[] = [];

  private addPostSubject = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

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

  addPost(title: string, content: string) {
    const post: Post = {
      id: null,
      postTitle: title,
      postContent: content
    };
    this.http
      .post<{ message: string, postId: string }>("http://localhost:3000/api/posts", post)
      .subscribe(responseData => {
        // console.log('Post Message :' + finalPost.message);
        console.log("Post Message :" + responseData.message);
        const id = responseData.postId;
        post.id = id;
        this.postsList.push(post);
        this.addPostSubject.next([...this.postsList]);
        console.log(...this.postsList);
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
