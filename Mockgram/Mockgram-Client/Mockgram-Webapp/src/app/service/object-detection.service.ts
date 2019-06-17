import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class ObjectDetectionService {
  private imageServer: String = environment.serverAddress.imageServer;

  constructor(private http: HttpClient) {}

  objectDetection(file): Observable<any> {
    return this.http.post(`${this.imageServer}/service/object-detection`, file);
  }
}
