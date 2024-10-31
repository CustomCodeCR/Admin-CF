import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { endpoint } from "@shared/apis/endpoint";
import { BaseResponse } from "@shared/models/base-api-response.interface";
import { AlertService } from "@shared/services/alert.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment as env } from "src/environments/environment";
import { BcfById, BcfResponse } from "../models/bcf-response.interface";
import { getIcon } from "@shared/functions/helpers";
import { BcfRequest } from "../models/bcf-request.interface";

@Injectable({
  providedIn: "root",
})
export class BcfService {
  constructor(private _http: HttpClient, private _alert: AlertService) {}

  private logAction(
    action: string,
    id: number | null = null,
    params: any = null
  ): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.LOGS_REGISTER}`;
    const logData = {
      Usuario: `${localStorage.getItem("username")}`,
      Modulo: "Bcf",
      TipoMetodo: action,
      Parametros: JSON.stringify({ id, ...params }),
      Estado: 1,
    };
    return this._http.post<BaseResponse>(requestUrl, logData);
  }

  GetAll(
    size: string,
    sort: string,
    order: string,
    page: number,
    getInputs: string
  ): Observable<BaseResponse> {
    const requestUrl = `${env.api}${
      endpoint.LIST_BCF
    }?records=${size}&sort=${sort}&order=${order}&numPage=${
      page + 1
    }${getInputs}`;

    return this._http.get<BaseResponse>(requestUrl).pipe(
      map((resp: BaseResponse) => {
        resp.data.forEach(function (prov: BcfResponse) {
          switch (prov.estado) {
            case 0:
              prov.badgeColor = "text-gray bg-gray-light";
              break;
            case 1:
              prov.badgeColor = "text-green bg-green-light";
              break;
            default:
              prov.badgeColor = "text-gray bg-gray-light";
              break;
          }
          prov.icEdit = getIcon("icEdit", "Editar Bcf", true);
          prov.icDelete = getIcon("icDelete", "Eliminar Bcf", true);
        });
        return resp;
      })
    );
  }

  BcfById(id: number): Observable<BcfById> {
    const requestUrl = `${env.api}${endpoint.BCF_BY_ID}${id}`;
    return this._http.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp.data;
      })
    );
  }

  BcfRegister(bcf: BcfRequest): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.BCF_REGISTER}`;
    return this._http.post(requestUrl, bcf).pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this.logAction("Registro", null, bcf);
        }
        return resp;
      })
    );
  }

  BcfEdit(id: number, Bcf: BcfRequest): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.BCF_EDIT}${id}`;
    return this._http.put<BaseResponse>(requestUrl, Bcf).pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this.logAction("Edición", id, Bcf);
        }
        return resp;
      })
    );
  }
}
