import { Component, OnInit, HostBinding } from "@angular/core";
import { Router } from "@angular/router";
import { MemberDetails } from "../models/vendor-members";
import { EditMainService } from "../services/editMain.service";
import { FranchiseInfoService } from "../services/franchiseInfo.service";

@Component({
  selector: "app-vendors-layout",
  templateUrl: "./vendors-layout.component.html",
  styleUrls: ["./vendors-layout.component.scss"]
})
export class VendorsLayoutComponent implements OnInit {
  @HostBinding() class: string =
    "d-flex flex-column col p-0 overflow-y-auto overflow-x-hidden";
  user: MemberDetails;
  editBtnEnabled: boolean;
  ratingArray: string[] = ["1", "2", "3", "4"];
  autoGenerateLinks = [
    {
      label: "Overview",
      icon: "fa-table",
      link: "overview/"
    },
    {
      icon: "fa-bars",
      label: "Deals",
      link: "deals/"
    },
    {
      icon: "fa-bars",
      label: "Meals",
      link: "meals/"
    },
    {
      icon: "fa-bars",
      label: "Orders",
      link: "orders/"
    },
    {
      icon: "fa-bars",
      label: "Sales",
      link: "sales/"
    }
  ];
  franchiseInfo: any = {};
  constructor(
    private router: Router,
    private franchiseInfoService: FranchiseInfoService,
    private editMainService: EditMainService
  ) {}

  ngOnInit() {
    this.franchiseInfoService
      .getFranchiseInfo()
      .subscribe(responseData => {
        this.franchiseInfo = responseData.data;
      });
    this.editMainService.editEnable.subscribe(val => {
      this.editBtnEnabled = val;
    });
  }

  getFranshiseBanner() {
    return this.franchiseInfo.welcomeImage || `https://via.placeholder.com/1100x200.png?text=upload+your+banner+here`; 
  }

  logoutHandler() {
    localStorage.clear();
    this.user = {};
    this.router.navigate(["auth"]);
  }
}
