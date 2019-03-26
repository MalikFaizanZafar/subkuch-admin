import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import { NavigationTab } from './navigation-tab';

@Component({
  selector: 'app-navigation-tabs',
  templateUrl: './navigation-tabs.component.html',
  styleUrls: ['./navigation-tabs.component.scss'],
})
export class NavigationTabsComponent {
  @Input() tabs: NavigationTab[] = [];

  @Output() tabClick: EventEmitter<NavigationTab> = new EventEmitter();

  constructor(private router: Router) {}

  onTabClick(tab: NavigationTab): void {
    if (!tab.active && !tab.disabled) {
      this.tabClick.emit(tab);
    }

    if (tab.route) {
      this.router.navigateByUrl(tab.route);
    }
  }

  trackByFn(index: number): number {
    return index;
  }
}
