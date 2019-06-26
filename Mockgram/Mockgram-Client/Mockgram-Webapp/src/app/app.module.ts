import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { Ng2ImgMaxModule } from "ng2-img-max";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { ContentComponent } from "./components/content/content.component";
import { HomeComponent } from "./pages/home/home.component";
import { ApiComponent } from "./pages/api/api.component";
import { ServiceComponent } from "./pages/service/service.component";
import { DownloadComponent } from "./pages/download/download.component";
import { Error404Component } from './pages/error404/error404.component';
import { Error500Component } from './pages/error500/error500.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ContentComponent,
    HomeComponent,
    ApiComponent,
    ServiceComponent,
    DownloadComponent,
    Error404Component,
    Error500Component
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, Ng2ImgMaxModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
