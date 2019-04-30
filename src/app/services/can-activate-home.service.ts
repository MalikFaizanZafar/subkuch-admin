import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CanActivateHome implements CanActivate {

  constructor(private router : Router) { }

  canActivate(
    route : ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      if(localStorage.getItem('Authorization')) {
        return true
      } else {
        this.router.navigate(['/'])
        return false
      }
  }
}
