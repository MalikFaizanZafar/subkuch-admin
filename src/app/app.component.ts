import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from './modules/auth/services/auth.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: UserAuthService){}

  ngOnInit() {
    if(this.authService.isAuthenticated) {
      const path = window.location.pathname;
      if (path && path !== '/vendors')
      this.router.navigate([path]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
