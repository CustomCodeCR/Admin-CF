import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse } from '@shared/models/base-api-response.interface';
import { AlertService } from '@shared/services/alert.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PolRequest } from '../models/pol-request.interface';
import { PolByIdResponse, PolResponse } from '../models/pol-response.interface';
import { getIcon } from '@shared/functions/helpers';
import { endpoint } from "@shared/apis/endpoint";
import { environment as env } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PolService {

  constructor(private _http: HttpClient, private _alert: AlertService) { }

  private logAction(
    action: string,
    id: number | null = null,
    params: any = null
  ): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.LOGS_REGISTER}`;
    const logData = {
      Usuario: `${localStorage.getItem('username')}`, 
      Modulo: "POL",
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
      endpoint.LIST_POL
    }?records=${size}&sort=${sort}&order=${order}&numPage=${
      page + 1
    }${getInputs}`;

    return this._http.get<BaseResponse>(requestUrl).pipe(
      map((resp: BaseResponse) => {
        resp.data.forEach(function (prov: PolResponse) {
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
          switch (prov.whs) {
            case 0:
              prov.badge2Color = "text-gray bg-gray-light";
              break;
            case 1:
              prov.badge2Color = "text-green bg-green-light";
              break;
            default:
              prov.badge2Color = "text-gray bg-gray-light";
              break;
          }
          prov.icEdit = getIcon("icEdit", "Editar POL", true);
          prov.icDelete = getIcon("icDelete", "Eliminar POL", true);
        });
        return resp;
      })
    );
  }

  PolById(id: number): Observable<PolByIdResponse> {
    const requestUrl = `${env.api}${endpoint.POL_BY_ID}${id}`;
    return this._http.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp.data;
      })
    );
  }

  PolRegister(pol: PolRequest): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.ITINERARIO_REGISTER}`;
    return this._http.post(requestUrl, pol).pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this.logAction("Registro", null, pol);
        }
        return resp;
      })
    );
  }

  PolEdit(
    id: number,
    pol: PolRequest
  ): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.POL_EDIT}${id}`;
    return this._http.put<BaseResponse>(requestUrl, pol).pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this.logAction("Edición", id, pol);
        }
        return resp;
      })
    );;
  }

  PolRemove(id: number): Observable<void> {
    const requestUrl = `${env.api}${endpoint.POL_REMOVE}${id}`;
    return this._http.put(requestUrl, "").pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this.logAction("Eliminación", id);
          this._alert.success("Excelente", resp.message);
        }
      })
    );
  }
}
