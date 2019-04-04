import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class ObjectDetectionService {
  private serverAddress: string = environment.serverAddress;

  constructor(private http: HttpClient) {}

  objectDetection(file): Observable<any> {
    return this.http.post(
      `${this.serverAddress}/service/object-detection`,
      file
    );
  }
}
