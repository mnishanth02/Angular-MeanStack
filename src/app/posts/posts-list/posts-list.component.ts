import { Component, OnInit, OnDestroy } from "@angular/core";
import { PostService } from "../post.service";
import { Post } from "../post.model";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material/paginator";
import { ThrowStmt } from "@angular/compiler";

@Component({
  selector: "app-posts-list",
  templateUrl: "./posts-list.component.html",
  styleUrls: ["./posts-list.component.css"]
})
export class PostsListComponent implements OnInit, OnDestroy {
  postArrays: Post[] = [];
  private postSub: Subscription;
  isLoading = false;
  totalPost = 0;
  postPerPage = 2;
  pageSizeOption = [1, 2, 5, 10];
  currentPage = 1;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPostsList(this.postPerPage, this.currentPage);
    this.postSub = this.postService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.postArrays = postData.posts;
        this.totalPost = postData.postCount;
      });
  }

  onDelete(postId: string) {
    this.isLoading = true;
    console.log("going to ddelete ID : " + postId);
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPostsList(this.postPerPage, this.currentPage);
    });
  }

  onPageChange(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postService.getPostsList(this.postPerPage, this.currentPage);
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }
}
