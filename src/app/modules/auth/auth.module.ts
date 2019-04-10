import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './Pages/login/login.component';
import { SignUpComponent } from './pages/signup/signup.component';
import { AuthService } from './services/auth.service';
import { SocialAuthService } from './services/Authentication.service';
import { ForgotPasswordComponent } from './Pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './Pages/reset-password/reset-password.component';
import { FranchiseAuthService } from './services/franchiseAuth.service';
import { NotificationsService } from 'app/services/notifications.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';

@NgModule({
  imports: [
    CommonModule, 
    AuthRoutingModule, 
    SharedModule, 
    ReactiveFormsModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyBVuIpEpE4Ke9xam26eRzVZItTslj6iTMY",
      authDomain: "subquch-d4369.firebaseapp.com",
      databaseURL: "https://subquch-d4369.firebaseio.com",
      projectId: "subquch-d4369",
      storageBucket: "",
      messagingSenderId: "54989238851"
    }),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  declarations: [
    LoginComponent, 
    SignUpComponent, ForgotPasswordComponent, ResetPasswordComponent,
  ],
  providers: [
    AuthService,
    FranchiseAuthService,
    SocialAuthService,
    NotificationsService
  ]
})
export class AuthModule {}
