import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseResponse } from "@shared/models/base-api-response.interface";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment as env } from "src/environments/environment";
import { endpoint } from "@shared/apis/endpoint";
import { LogsRequest } from "@shared/models/logs-request.interface";

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  constructor(private _http: HttpClient) { }

  LogRegister(log: LogsRequest): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.LOGS_REGISTER}`;
    return this._http.post(requestUrl, log).pipe(
      map((resp: BaseResponse) => {
        return resp;
      })
    );
  }
}
