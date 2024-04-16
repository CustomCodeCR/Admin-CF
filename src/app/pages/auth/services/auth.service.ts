import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Login } from "../models/login.interface";
import { Observable, BehaviorSubject } from "rxjs";
import { environment as env } from "src/environments/environment";
import { endpoint, httpOptions } from "@shared/apis/endpoint";
import { map } from "rxjs/operators";
import { BaseResponse } from "@shared/models/base-api-response.interface";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private user: BehaviorSubject<BaseResponse>;

  public get userToken(): BaseResponse {
    return this.user.value;
  }

  constructor(private http: HttpClient) {
    this.user = new BehaviorSubject<BaseResponse>(
      JSON.parse(localStorage.getItem("token"))
    );
  }

  getUserPermissions(): number[] {
    const user = JSON.parse(localStorage.getItem("users"));
    if (user) {
      const typ = user.typ;
      return typ ? typ.split(",").map(Number) : [];
    }
    return [];
  }

  login(req: Login, authType: string): Observable<BaseResponse> {
    localStorage.setItem("authType", "Interno");
    const requestUrl = `${env.api}${endpoint.LOGIN}?authType=${authType}`;
    return this.http.post<BaseResponse>(requestUrl, req, httpOptions).pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          localStorage.setItem("token", JSON.stringify(resp.data));
          this.user.next(resp.data);
          const [encodedHeader, encodedPayload] = resp.data.split(".").slice(0, 2);
          const decodedPayload = atob(encodedPayload);
          const user = JSON.parse(decodedPayload);
          localStorage.setItem("users", JSON.stringify(user));
        }

        return resp;
      })
    );
  }

  loginWithGoogle(
    credential: string,
    authType: string
  ): Observable<BaseResponse> {
    localStorage.setItem("authType", "Externo");
    const requestUrl = `${env.api}${endpoint.LOGIN_GOOGLE}?authType=${authType}`;
    return this.http
      .post<BaseResponse>(requestUrl, JSON.stringify(credential), httpOptions)
      .pipe(
        map((resp: BaseResponse) => {
          if (resp.isSuccess) {
            localStorage.setItem("token", JSON.stringify(resp.data));
            this.user.next(resp.data);
            const [encodedHeader, encodedPayload] = resp.data.split(".").slice(0, 2);
            const decodedPayload = atob(encodedPayload);
            const user = JSON.parse(decodedPayload);
            localStorage.setItem("users", JSON.stringify(user));
          }

          return resp;
        })
      );
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("users");
    localStorage.removeItem("authType");
    this.user.next(null);
    window.location.reload();
  }
}
