import { Component } from '@angular/core';

import { IsSidebarItemNodes } from 'app/lib/sidebar';

@Component({
  selector: 'app-sidebar-topbar',
  templateUrl: './sidebar-topbar.component.html',
  styleUrls: ['./sidebar-topbar.component.scss']
})
export class SidebarTopbarComponent {

  // data: any[] = tableMockData;

  autoGenerateLinks: IsSidebarItemNodes[] = [
    {
      label: 'Table',
      icon: 'fa-table',
      auxInfo: {
        class: 'warning',
        info: 15
      },
      nodes: [
        {
          icon: 'fa-columns',
          label: 'Sidebar',
        },
        {
          label: 'Tools',
          icon: 'fa-cogs',
          nodes: [
            {
              icon: 'fa-pencil',
              label: 'Sketch mode',
              auxInfo: {
                class: 'success',
                info: 'new'
              },
            }
          ]
        }
      ]
    },
    {
      icon: 'fa-bars',
      label: 'TopBar'
    }
  ];
}
