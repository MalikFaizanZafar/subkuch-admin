import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SidebarTopbarComponent } from "./sidebar-topbar.component";

const routes: Routes = [
  { path: "", component: SidebarTopbarComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SideBarTopBarRoutingModule {}
