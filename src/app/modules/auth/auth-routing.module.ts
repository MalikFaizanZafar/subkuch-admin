import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginComponent } from "./Pages/login/login.component";
import { SignUpComponent } from "./pages/signup/signup.component";
import { ForgotPasswordComponent } from "./Pages/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./Pages/reset-password/reset-password.component";

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "signup", component: SignUpComponent },
  { path: "forgot-password", component: ForgotPasswordComponent },
  { path: "reset-password", component: ResetPasswordComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
