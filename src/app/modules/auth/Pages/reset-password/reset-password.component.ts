import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialAuthService } from '../../services/Authentication.service';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  passwordForm: FormGroup;

  constructor(private router : Router, private authenticationService : SocialAuthService) { }

  ngOnInit() {
    this.passwordForm = new FormGroup({
      password: new FormControl(null, [Validators.required])
    });
  }

  onLoginSubmit(form: FormGroup) {
    if (this.passwordForm.valid) {
      let password = this.passwordForm.value;
      this.authenticationService.ResetPassowrd(password);
    }
  }

}

