import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  navItems: NavItem[];
  activatedRouter: string; // default active page at index 0

  constructor(public router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.activatedRouter = this.router.url.split("/").pop();
      }
    });
    this.navItems = [
      new NavItem("Home", "fa fa-home", "home"),
      new NavItem("Download", "fa fa-file-download", "download"),
      new NavItem("API", "fa fa-list-alt", "api"),
      new NavItem("Service", "fa fa-cloud", "service")
    ];
  }

  nav(navItem: NavItem) {
    this.router.navigateByUrl(navItem.link);
    this.activatedRouter = navItem.link;
  }
}

class NavItem {
  constructor(
    public name: string,
    public iconName: string,
    public link: string
  ) {}
}
