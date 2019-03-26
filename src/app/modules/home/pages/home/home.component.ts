import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  @HostBinding() class: string = 'd-flex flex-column col p-0 overflow-y-auto overflow-x-hidden';
}
