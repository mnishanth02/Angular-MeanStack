import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private postsList: Post[] = [];

  private addPostSubject = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  getPostsList() {

    this.http.get<{ mesage: string, posts: Post[] }>('http://localhost:3000/api/posts').subscribe((postData) => {
      this.postsList = postData.posts;
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
    this.http.post<{ message: string; posts: any }>('http://localhost:3000/api/posts', post)
      .pipe(map(data => {
        return data.posts.map(post => {
          return {
            postTitle: post.postTitle,
            postContent: post.postContent,
            id: post._id
          };
        });
      })).subscribe(finalPost => {
        console.log(finalPost);
        this.postsList.push(finalPost);
        this.addPostSubject.next([...this.postsList]);
      });
  }

  deletePost(postId: string) {
    this.http.delete
  }
}
