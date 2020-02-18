import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  @ViewChild('postForm', { static: false }) postForm: NgForm;

  constructor(private postService: PostService) { }

  ngOnInit(): void {
  }

  addPost() {
    if (!this.postForm.valid) {
      return false;
    }

    this.postService.addPost(
      this.postForm.form.value.postTitle,
      this.postForm.form.value.postContent
    );
    this.postForm.resetForm();
  }


}
