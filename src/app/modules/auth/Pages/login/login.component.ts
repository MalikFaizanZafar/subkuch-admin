import { Component, HostBinding, OnInit, TemplateRef } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { IsButton, IsModalService } from "../../../../lib";
// import { AuthService } from '../../services/auth.service';
import { Router } from "@angular/router";
import { FranchiseAuthService } from "app/modules/auth/services/franchiseAuth.service";
import { IsToasterService, IsToastPosition } from "../../../../lib/toaster";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  @HostBinding() class: string =
    "d-flex flex-column col p-0 overflow-y-auto overflow-x-hidden";
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  newPasswordForm: FormGroup;
  errorMessage: string;
  unAuthorized: boolean = false;
  emailNotVerified: boolean = false;
  forgotPassword: boolean = false;
  emailVerified: boolean = false;
  email: string = "";

  constructor(
    // private authService: AuthService,
    private franchiseAuthService: FranchiseAuthService,
    private router: Router,
    private toaster: IsToasterService,
    private isModal: IsModalService
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email])
    });
    this.newPasswordForm = new FormGroup({
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8)
      ]),
      confirmPassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(8)
      ])
    });
  }

  onLoginSubmit(
    form: FormGroup,
    btn: IsButton,
    veirfyTemplate: TemplateRef<any>,
    activeTemplate: TemplateRef<any>
  ) {
    this.unAuthorized = false;
    if (this.loginForm.valid) {
      btn.startLoading();
      let user = this.loginForm.value;
      this.franchiseAuthService.login(user.username, user.password).subscribe(
        res => {
          localStorage.setItem(
            "Authorization",
            `${res.tokenType} ${res.accessToken}`
          );
          this.toaster.popSuccess("Logged In Successfully", {
            position: IsToastPosition.BottomRight
          });
          btn.stopLoading();
          this.router.navigate(["/vendors"]);
        },
        err => {
          if (err.status === 401) {
            this.unAuthorized = true;
            btn.stopLoading();
            return;
          }
          if (err.error.indexOf("verified") > -1) {
            this.isModal.open(veirfyTemplate, { data: err.error });
            btn.stopLoading();
            return;
          }

          if (err.error.indexOf("active") > -1) {
            this.isModal.open(activeTemplate, { data: err.error });
            btn.stopLoading();
            return;
          }
        }
      );
    } else {
      return;
    }
  }

  onForgotEmailSubmit(btn: IsButton) {
    if (this.forgotPasswordForm.valid) {
      let temp = this.forgotPasswordForm.value;
      let data = {
        email: temp.email,
        password: ""
      };
      btn.startLoading();
      this.franchiseAuthService
        .forgotEmailPost(data)
        .subscribe(forgotEmailResponse => {
          this.emailVerified = forgotEmailResponse.data.emailVerified;
          if (this.emailVerified == false) {
            this.unAuthorized = true;
            btn.stopLoading();
          } else {
            this.toaster.popSuccess("Email Verified Successfully", {
              position: IsToastPosition.BottomRight
            });
            btn.stopLoading();
            this.email = data.email;
            this.forgotPasswordForm.reset();
          }
        });
    }
  }

  onSubmitNewPasswordForm(btn: IsButton) {
    if (this.newPasswordForm.valid) {
      btn.startLoading();
      let temp = this.newPasswordForm.value;
      let data = {
        email: this.email,
        password: temp.password
      };
      this.franchiseAuthService
        .forgotPasswordPost(data)
        .subscribe(forgotPassResponse => {
          this.forgotPassword = false;
          this.emailVerified = false;
          this.newPasswordForm.reset();
          btn.stopLoading();
        });
    }
  }
}
