import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { endpoint } from "@shared/apis/endpoint";
import { getIcon } from "@shared/functions/helpers";
import { BaseResponse } from "@shared/models/base-api-response.interface";
import { AlertService } from "@shared/services/alert.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment as env } from "src/environments/environment";
import { MultimediaRequest } from "../models/multimedia-request.interface";
import {
  MultimediaByIdResponse,
  MultimediaResponse,
} from "../models/multimedia-response.interface";

@Injectable({
  providedIn: "root",
})
export class MultimediaService {
  constructor(private _http: HttpClient, private _alert: AlertService) {}

  private logAction(
    action: string,
    id: number | null = null,
    params: any = null
  ): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.LOGS_REGISTER}`;
    const logData = {
      Multimedia: `${localStorage.getItem('username')}`, 
      Modulo: "Multimedia",
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
      endpoint.LIST_MULTIMEDIA
    }?records=${size}&sort=${sort}&order=${order}&numPage=${
      page + 1
    }${getInputs}`;

    return this._http.get<BaseResponse>(requestUrl).pipe(
      map((resp: BaseResponse) => {
        resp.data.forEach(function (prov: MultimediaResponse) {
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
          prov.icEdit = getIcon("icEdit", "Editar Multimedia", true);
          prov.icDelete = getIcon("icDelete", "Eliminar Multimedia", true);
        });
        return resp;
      })
    );
  }

  MultimediaById(id: number): Observable<MultimediaByIdResponse> {
    const requestUrl = `${env.api}${endpoint.MULTIMEDIA_BY_ID}${id}`;
    return this._http.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp.data;
      })
    );
  }

  MultimediaRegister(Multimedia: MultimediaRequest): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.MULTIMEDIA_REGISTER}`;
    const formDataMultimedia = this._builFormDataMultimedia(Multimedia);
    return this._http.post(requestUrl, formDataMultimedia).pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this.logAction("Registro", null, Multimedia);
        }
        return resp;
      })
    );
  }

  MultimediaEdit(id: number, Multimedia: MultimediaRequest): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.MULTIMEDIA_EDIT}${id}`;
    const formDataMultimedia = this._builFormDataMultimedia(Multimedia);
    return this._http.put<BaseResponse>(requestUrl, formDataMultimedia).pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this.logAction("Edición", id, Multimedia);
        }
        return resp;
      })
    );;
  }

  MultimediaRemove(id: number): Observable<void> {
    const requestUrl = `${env.api}${endpoint.MULTIMEDIA_REMOVE}${id}`;
    return this._http.put(requestUrl, "").pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this.logAction("Eliminación", id);
          this._alert.success("Excelente", resp.message);
        }
      })
    );
  }

  private _builFormDataMultimedia(Multimedia: MultimediaRequest): FormData {
    const formData = new FormData();
    formData.append("nombre", Multimedia.nombre),
    formData.append("multimedia", Multimedia.multimedia),
    formData.append("estado", Multimedia.estado.toString());

    return formData;
  }
}
