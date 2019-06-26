import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { DownloadComponent } from "./pages/download/download.component";
import { ApiComponent } from "./pages/api/api.component";
import { ServiceComponent } from "./pages/service/service.component";
import { Error404Component } from "./pages/error404/error404.component";

const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "download", component: DownloadComponent },
  { path: "api", component: ApiComponent },
  { path: "service", component: ServiceComponent },
  { path: "404", component: Error404Component },
  { path: "**", redirectTo: "/404" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
