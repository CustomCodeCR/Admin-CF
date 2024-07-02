import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from '@shared/services/alert.service';
import { OrigenRequest } from '../models/origen-request.interface';
import { map } from 'rxjs/operators';
import { BaseResponse } from '@shared/models/base-api-response.interface';
import { Observable } from 'rxjs';
import { getIcon } from '@shared/functions/helpers';
import { OrigenByIdResponse, OrigenResponse } from '../models/origen-response.interface';
import { endpoint } from "@shared/apis/endpoint";
import { environment as env } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OrigenService {

  constructor(private _http: HttpClient, private _alert: AlertService) { }

  private logAction(
    action: string,
    id: number | null = null,
    params: any = null
  ): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.LOGS_REGISTER}`;
    const logData = {
      Usuario: `${localStorage.getItem('username')}`, 
      Modulo: "Origen",
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
      endpoint.LIST_ORIGEN
    }?records=${size}&sort=${sort}&order=${order}&numPage=${
      page + 1
    }${getInputs}`;

    return this._http.get<BaseResponse>(requestUrl).pipe(
      map((resp: BaseResponse) => {
        resp.data.forEach(function (prov: OrigenResponse) {
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
          prov.icEdit = getIcon("icEdit", "Editar Origen", true);
          prov.icDelete = getIcon("icDelete", "Eliminar Origen", true);
        });
        return resp;
      })
    );
  }

  OrigenById(id: number): Observable<OrigenByIdResponse> {
    const requestUrl = `${env.api}${endpoint.ORIGEN_BY_ID}${id}`;
    return this._http.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp.data;
      })
    );
  }

  OrigenRegister(Origen: OrigenRequest): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.ORIGEN_REGISTER}`;
    const formData = this._builFormDataOrigen(Origen);
    return this._http.post(requestUrl, formData).pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this.logAction("Registro", null, Origen);
        }
        return resp;
      })
    );
  }

  OrigenEdit(
    id: number,
    Origen: OrigenRequest
  ): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.ORIGEN_EDIT}${id}`;
    const formData = this._builFormDataOrigen(Origen);
    return this._http.put<BaseResponse>(requestUrl, formData).pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this.logAction("Edición", id, Origen);
        }
        return resp;
      })
    );;
  }

  OrigenRemove(id: number): Observable<void> {
    const requestUrl = `${env.api}${endpoint.ORIGEN_REMOVE}${id}`;
    return this._http.put(requestUrl, "").pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this.logAction("Eliminación", id);
          this._alert.success("Excelente", resp.message);
        }
      })
    );
  }

  private _builFormDataOrigen(origen: OrigenRequest): FormData {
    const formData = new FormData();
    formData.append("nombre", origen.nombre),
      formData.append("imagen", origen.imagen),
      formData.append("estado", origen.estado.toString());

    return formData;
  }
}
