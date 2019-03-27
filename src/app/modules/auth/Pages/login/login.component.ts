import { Component, HostBinding, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IsButton } from '../../../../lib';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FranchiseAuthService } from 'app/modules/auth/services/franchiseAuth.service';

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
    private franchiseAuthService : FranchiseAuthService, 
    private router: Router) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });
  }

  onLoginSubmit(form: FormGroup, btn: IsButton) {
    if (this.loginForm.valid) {
      btn.startLoading();
      let user = this.loginForm.value;
      // this.authService.getUserLoggedIn(newUser.email, newUser.password)
      //   .pipe()
      //   .subscribe(res => {
      //     btn.stopLoading();
      //     if (res.statusCode !== 200) {
      //       this.errorMessage = res.statusMessage;
      //       return;
      //     } else  {
      //       if (!res.data.isEmailVerified) {
      //         this.errorMessage = 'Please verify your email address.'
      //         return;
      //       }
      //       if (!res.data.isActive) {
      //         this.errorMessage = 'Account is not active! please contact administrator.'
      //         return; 
      //       }
      //       let token = newUser.email;
      //       localStorage.setItem('user', token)
      //       localStorage.setItem('userData', JSON.stringify(newUser))
      //       this.router.navigate(['/vendors', `${token}`]);
      //     }
      //   })
      this.franchiseAuthService.login(user.username, user.password).subscribe(res => {
        localStorage.setItem('Authorization', `${res.tokenType} ${res.accessToken}`)
        let Authorization = localStorage.getItem('Authorization');
        console.log('Authorization : ', Authorization)
        this.router.navigate(['/vendors']);
      })
    } else {
      return;
    }
  }
}
