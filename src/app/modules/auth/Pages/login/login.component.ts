import { Component, HostBinding, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IsButton } from '../../../../lib';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @HostBinding() class: string = 'd-flex flex-column col p-0 overflow-y-auto overflow-x-hidden';
  loginForm: FormGroup;
  errorMessage: string;

  constructor(
    private authService: AuthService, 
    private router: Router) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });
  }

  onLoginSubmit(form: FormGroup, btn: IsButton) {
    if (this.loginForm.valid) {
      btn.startLoading();
      let newUser = this.loginForm.value;
      this.authService.getUserLoggedIn(newUser.email, newUser.password)
        .pipe()
        .subscribe(res => {
          btn.stopLoading();
          if (res.statusCode !== 200) {
            this.errorMessage = res.statusMessage;
            return;
          } else  {
            if (!res.data.isEmailVerified) {
              this.errorMessage = 'Please verify your email address.'
              return;
            }
            if (!res.data.isActive) {
              this.errorMessage = 'Account is not active! please contact administrator.'
              return; 
            }
            let token = newUser.email;
            localStorage.setItem('user', token)
            localStorage.setItem('userData', JSON.stringify(newUser))
            this.router.navigate(['/vendors', `${token}`]);
          }
        })
    } else {
      return;
    }
  }
}
