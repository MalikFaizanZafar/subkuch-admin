import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() icon: string;
  @Input() text: string;
  @Input() color: string = '#03a9f4';
  @Input() url?: string;
  @Input() type: string;
  @Input() loading: boolean = false;

  constructor(private router: Router) {}

  navigateToUrl(): void {
    if (this.url) {
      this.router.navigateByUrl(this.url);
    }
  }
}
