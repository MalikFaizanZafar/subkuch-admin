import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialAuthService } from '../../services/Authentication.service';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  emailForm: FormGroup;

  constructor(private router : Router, private authenticationService : SocialAuthService) { }

  ngOnInit() {
    this.emailForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email])
    });
  }

  onLoginSubmit(form: FormGroup) {
    if (this.emailForm.valid) {
      let email = this.emailForm.value;
      this.authenticationService.forgotPassowrd(email);
      this.router.navigate(['/auth/reset-password'])
    }
  }

}
