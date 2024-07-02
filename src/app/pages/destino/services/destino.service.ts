import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from '@shared/services/alert.service';
import { DestinoRequest } from '../models/destino-request.interface';
import { map } from 'rxjs/operators';
import { BaseResponse } from '@shared/models/base-api-response.interface';
import { Observable } from 'rxjs';
import { getIcon } from '@shared/functions/helpers';
import { DestinoByIdResponse, DestinoResponse } from '../models/destino-response.interface';
import { endpoint } from "@shared/apis/endpoint";
import { environment as env } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DestinoService {

  constructor(private _http: HttpClient, private _alert: AlertService) { }

  private logAction(
    action: string,
    id: number | null = null,
    params: any = null
  ): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.LOGS_REGISTER}`;
    const logData = {
      Usuario: `${localStorage.getItem('username')}`, 
      Modulo: "Destino",
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
      endpoint.LIST_DESTINO
    }?records=${size}&sort=${sort}&order=${order}&numPage=${
      page + 1
    }${getInputs}`;

    return this._http.get<BaseResponse>(requestUrl).pipe(
      map((resp: BaseResponse) => {
        resp.data.forEach(function (prov: DestinoResponse) {
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
          prov.icEdit = getIcon("icEdit", "Editar Destino", true);
          prov.icDelete = getIcon("icDelete", "Eliminar Destino", true);
        });
        return resp;
      })
    );
  }

  DestinoById(id: number): Observable<DestinoByIdResponse> {
    const requestUrl = `${env.api}${endpoint.DESTINO_BY_ID}${id}`;
    return this._http.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp.data;
      })
    );
  }

  DestinoRegister(Destino: DestinoRequest): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.DESTINO_REGISTER}`;
    const formData = this._builFormDataDestino(Destino);
    return this._http.post(requestUrl, formData).pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this.logAction("Registro", null, Destino);
        }
        return resp;
      })
    );
  }

  DestinoEdit(
    id: number,
    Destino: DestinoRequest
  ): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.DESTINO_EDIT}${id}`;
    const formData = this._builFormDataDestino(Destino);
    return this._http.put<BaseResponse>(requestUrl, formData).pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this.logAction("Edición", id, Destino);
        }
        return resp;
      })
    );;
  }

  DestinoRemove(id: number): Observable<void> {
    const requestUrl = `${env.api}${endpoint.DESTINO_REMOVE}${id}`;
    return this._http.put(requestUrl, "").pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this.logAction("Eliminación", id);
          this._alert.success("Excelente", resp.message);
        }
      })
    );
  }

  private _builFormDataDestino(Destino: DestinoRequest): FormData {
    const formData = new FormData();
    formData.append("nombre", Destino.nombre),
      formData.append("imagen", Destino.imagen),
      formData.append("estado", Destino.estado.toString());

    return formData;
  }
}
