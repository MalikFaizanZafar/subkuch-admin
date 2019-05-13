import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from './modules/auth/services/auth.service';
import { NotificationsService } from './services/notifications.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: UserAuthService, 
    private notificationServcie: NotificationsService) {}

  ngOnInit() {
    if(this.authService.isAuthenticated) {
      this.notificationServcie.getPermission();
      this.notificationServcie.receiveMessage();
      const path = window.location.pathname;
      if (path && path !== '/vendors' && path !== '/') {
        this.router.navigate([path]);
      } else {
        this.router.navigate(['/vendors']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }
}
