import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment as env } from "./../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class UploadXslxService {
  constructor(private http: HttpClient) {}

  executeUpload(file: File, url: string): Observable<any> {
    const formData = new FormData();
    formData.append("excel", file);

    const headers = new HttpHeaders();

    return this.http.post(`${env.api}${url}`, formData, {
      headers: headers,
      reportProgress: true,
      observe: "events"
    });
  }
}