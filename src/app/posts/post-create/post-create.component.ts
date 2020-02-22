import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { PostService } from "../post.service";
import { Post } from "../post.model";
import { ActivatedRoute, ParamMap } from "@angular/router";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  @ViewChild("postForm", { static: false }) postForm: NgForm;

  private mode = "create";
  private postId: string;
  post: Post;
  isLoading = false;

  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            postTitle: postData.postTitle,
            postContent: postData.postContent
          };
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  addSavePost() {
    if (!this.postForm.valid) {
      return false;
    }
    this.isLoading = true;
    if (this.mode == "create") {
      this.postService.addPost(
        this.postForm.form.value.postTitle,
        this.postForm.form.value.postContent
      );
    } else {
      this.postService.updatePost(
        this.postId,
        this.postForm.form.value.postTitle,
        this.postForm.form.value.postContent
      );
    }

    this.postForm.resetForm();
  }
}
