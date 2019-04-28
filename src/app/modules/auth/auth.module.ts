import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { SocialAuthService } from './services/Authentication.service';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { FranchiseAuthService } from './services/franchiseAuth.service';
import { UserAuthService } from './services/auth.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { VerificationModalComponent } from './components/verification-modal/verification-modal.component';
import { SignUpComponent } from './pages/signup/signup.component';

@NgModule({
  imports: [
    CommonModule, 
    AuthRoutingModule, 
    SharedModule, 
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule
  ],
  declarations: [
    LoginComponent, 
    ForgotPasswordComponent, 
    ResetPasswordComponent, 
    VerificationModalComponent,
    SignUpComponent
  ],
  providers: [
    UserAuthService,
    FranchiseAuthService,
    SocialAuthService
  ]
})
export class AuthModule {}
