import { Component, HostBinding, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';

import { IsButton, IsModalService } from '../../../../lib';
import { UserAuthService } from '../../services/auth.service';
import { AvailableServices, AvailableServicesResponse } from '../../models/availableServices';
import { VendorUser } from '../../models/vendor-members';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignUpComponent implements OnInit {
  @HostBinding('class')
  hostClass: string = 'd-flex flex-column col p-0 overflow-y-auto overflow-x-hidden';
  message = '';
  signupForm: FormGroup;
  loading: boolean = false;
  selectedService: number = 0;
  availableServices: AvailableServices[] = [];
  emailExists: boolean; false;

  constructor(private authService: UserAuthService, 
              private isModal: IsModalService, 
              private router: Router){}

  ngOnInit() {
    this.emailExists = false;
    this.signupForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      brandName: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8)
      ]),
      confirmPassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(8)
      ]),
      service: new FormControl(0, [
        Validators.required
      ]),
      contact: new FormControl(null, [
        Validators.required
      ])
    });

    this.authService.getServices().subscribe((res: AvailableServicesResponse) => {
      this.availableServices = res.data.filter(item => item.enabled);
    })
  }

  onSubmit(form: NgForm, btn: IsButton, template: TemplateRef<any>) {
    this.emailExists = false;
    if (this.signupForm.controls.password.value !== this.signupForm.controls.confirmPassword.value) {
      return;
    }
    if (this.signupForm.valid) {
      btn.startLoading();
      let user = this.signupForm.value;
      const vendor = new VendorUser();      
      
      vendor.contact = user.contact,
      vendor.email = user.email,
      vendor.name = user.brandName,
      vendor.password =  user.password,
      vendor.service_id=  parseInt(user.service, 10),
      vendor.username =  ' ';
      this.authService.signup(vendor).subscribe(res => {
        console.log("Signup res is : ", res)
        btn.stopLoading();
        if (res) {
          this.isModal.open(template, {data: vendor.email})
            .onClose.subscribe(() => {
              this.router.navigate(['/']);
              form.reset();
            });
        }
      }, error => {
        if(error.error.message == 'Email Already Exists'){
          this.emailExists = true;
          btn.stopLoading();
        }
      })
    } else {
      return;
    }  
  }
}
