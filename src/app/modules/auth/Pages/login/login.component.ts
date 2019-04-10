import { Component, HostBinding, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IsButton } from '../../../../lib';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FranchiseAuthService } from 'app/modules/auth/services/franchiseAuth.service';
import { NotificationsService } from 'app/services/notifications.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @HostBinding() class: string = 'd-flex flex-column col p-0 overflow-y-auto overflow-x-hidden';
  loginForm: FormGroup;
  errorMessage: string;
  message;

  constructor(
    private authService: AuthService,
    private franchiseAuthService : FranchiseAuthService,
    private notificationsService : NotificationsService, 
    private router: Router) {}

  ngOnInit() {
    console.log('ngOnInit called ')
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });
    this.notificationsService.getPermission()
    this.notificationsService.receiveMessage()
    this.message = this.notificationsService.currentMessage
    console.log('message has : ', this.message)
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
        this.router.navigate(['/vendors']);
      })
    } else {
      return;
    }
  }
}
