import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { endpoint } from "@shared/apis/endpoint";
import { getIcon } from "@shared/functions/helpers";
import { BaseResponse } from "@shared/models/base-api-response.interface";
import { AlertService } from "@shared/services/alert.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment as env } from "src/environments/environment";
import { NoticiaRequest } from "../models/noticia-request.interface";
import {
  NoticiaById,
  NoticiaResponse,
} from "../models/noticia-response.interface";

@Injectable({
  providedIn: "root",
})
export class NoticiaService {
  constructor(private _http: HttpClient, private _alert: AlertService) {}

  GetAll(
    size: string,
    sort: string,
    order: string,
    page: number,
    getInputs: string
  ): Observable<BaseResponse> {
    const requestUrl = `${env.api}${
      endpoint.LIST_NOTICIA
    }?records=${size}&sort=${sort}&order=${order}&numPage=${
      page + 1
    }${getInputs}`;

    return this._http.get<BaseResponse>(requestUrl).pipe(
      map((resp: BaseResponse) => {
        resp.data.forEach(function (prov: NoticiaResponse) {
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
          prov.icEdit = getIcon("icEdit", "Editar noticia", true);
          prov.icDelete = getIcon("icDelete", "Eliminar noticia", true);
        });
        return resp;
      })
    );
  }

  noticiaById(id: number): Observable<NoticiaById> {
    const requestUrl = `${env.api}${endpoint.NOTICIA_BY_ID}${id}`;
    return this._http.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp.data;
      })
    );
  }

  noticiaRegister(noticia: NoticiaRequest): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.NOTICIA_REGISTER}`;
    const formDataNoticia = this._builFormDataNoticia(noticia);
    return this._http.post(requestUrl, formDataNoticia).pipe(
      map((resp: BaseResponse) => {
        return resp;
      })
    );
  }

  noticiaEdit(id: number, noticia: NoticiaRequest): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.NOTICIA_EDIT}${id}`;
    const formDataNoticia = this._builFormDataNoticia(noticia);
    return this._http.put<BaseResponse>(requestUrl, formDataNoticia);
  }

  noticiaRemove(id: number): Observable<void> {
    const requestUrl = `${env.api}${endpoint.NOTICIA_REMOVE}${id}`;
    return this._http.put(requestUrl, "").pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this._alert.success("Excelente", resp.message);
        }
      })
    );
  }

  private _builFormDataNoticia(noticia: NoticiaRequest): FormData {
    const formData = new FormData();
    formData.append("titulo", noticia.titulo),
      formData.append("subtitulo", noticia.subtitulo),
      formData.append("contenido", noticia.contenido),
      formData.append("imagen", noticia.imagen),
      formData.append("estado", noticia.estado.toString());

    return formData;
  }
}
