import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostsListComponent } from "./posts/posts-list/posts-list.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
  { path: "", component: PostsListComponent },
  { path: "create", component: PostCreateComponent },
  { path: "edit/:postId", component: PostCreateComponent },
  { path: "login", component: LoginComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
