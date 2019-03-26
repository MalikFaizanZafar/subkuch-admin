import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider} from "angularx-social-login"

import { IsButton } from '../../../../lib';
import { SocialAuthService } from './../../services/Authentication.service'
@Component({
  selector: 'app-sign-up',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignUpComponent implements OnInit {
  @HostBinding('class')
  hostClass: string = 'd-flex flex-column col p-0 overflow-y-auto overflow-x-hidden';
  message = '';
  signupForm: FormGroup;
  loading: boolean = false;

  constructor( 
    private authService: AuthService, private socialAuthService : SocialAuthService,
    private router: Router) {}

  ngOnInit() {
    this.signupForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8)
      ])
    });
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.authService.authState.subscribe((user) => {
      this.socialAuthService.facebookSignup(user);
    });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.authService.authState.subscribe((user) => {
      this.socialAuthService.googleSignup(user);
    });
  }

  onSignSubmit(form: any, btn: IsButton) {
    // this.loading = true;
    // if (this.signupForm.valid) {
    //   let user = this.signupForm.value;
    //   this.message = this.authService.signUpUser(user.email, user.password);
    //   setTimeout(() => {
    //     this.loading = false;
    //     this.message = '';
    //     form.submitted = false;
    //     this.router.navigate(['auth'])
    //   }, 2000);
    // } else {
    //   this.loading = false;
    //   console.log('Form is not Valid');
    // }
  }
}
