import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../post.service';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit, OnDestroy {

  postArrays: Post[] = [];
  private postSub: Subscription;

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.postService.getPostsList();
    this.postSub = this.postService.getPostUpdateListener().subscribe((post: Post[]) => {
      this.postArrays = post;
    });
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }

  onDelete(id: string) {

  }

}
