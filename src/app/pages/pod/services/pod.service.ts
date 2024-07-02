import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse } from '@shared/models/base-api-response.interface';
import { AlertService } from '@shared/services/alert.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PodRequest } from '../models/pod-request.interface';
import { PodByIdResponse, PodResponse } from '../models/pod-response.interface';
import { getIcon } from '@shared/functions/helpers';
import { endpoint } from "@shared/apis/endpoint";
import { environment as env } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PodService {

  constructor(private _http: HttpClient, private _alert: AlertService) { }

  private logAction(
    action: string,
    id: number | null = null,
    params: any = null
  ): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.LOGS_REGISTER}`;
    const logData = {
      Usuario: `${localStorage.getItem('username')}`, 
      Modulo: "Pod",
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
      endpoint.LIST_POD
    }?records=${size}&sort=${sort}&order=${order}&numPage=${
      page + 1
    }${getInputs}`;

    return this._http.get<BaseResponse>(requestUrl).pipe(
      map((resp: BaseResponse) => {
        resp.data.forEach(function (prov: PodResponse) {
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
          prov.icEdit = getIcon("icEdit", "Editar POD", true);
          prov.icDelete = getIcon("icDelete", "Eliminar POD", true);
        });
        return resp;
      })
    );
  }

  PodById(id: number): Observable<PodByIdResponse> {
    const requestUrl = `${env.api}${endpoint.POD_BY_ID}${id}`;
    return this._http.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp.data;
      })
    );
  }

  PodRegister(Pod: PodRequest): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.ITINERARIO_REGISTER}`;
    return this._http.post(requestUrl, Pod).pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this.logAction("Registro", null, Pod);
        }
        return resp;
      })
    );
  }

  PodEdit(
    id: number,
    Pod: PodRequest
  ): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.POD_EDIT}${id}`;
    return this._http.put<BaseResponse>(requestUrl, Pod).pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this.logAction("Edición", id, Pod);
        }
        return resp;
      })
    );;
  }

  PodRemove(id: number): Observable<void> {
    const requestUrl = `${env.api}${endpoint.POD_REMOVE}${id}`;
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
