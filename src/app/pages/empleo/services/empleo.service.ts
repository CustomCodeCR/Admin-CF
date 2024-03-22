import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { endpoint } from "@shared/apis/endpoint";
import { getIcon } from "@shared/functions/helpers";
import { BaseResponse } from "@shared/models/base-api-response.interface";
import { AlertService } from "@shared/services/alert.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment as env } from "src/environments/environment";
import { EmpleoRequest } from "../models/empleo-request.interface";
import {
  EmpleoById,
  EmpleoResponse,
} from "../models/empleo-response.interface";

@Injectable({
  providedIn: "root",
})
export class EmpleoService {
  constructor(private _http: HttpClient, private _alert: AlertService) {}

  GetAll(
    size: string,
    sort: string,
    order: string,
    page: number,
    getInputs: string
  ): Observable<BaseResponse> {
    const requestUrl = `${env.api}${
      endpoint.LIST_EMPLEO
    }?records=${size}&sort=${sort}&order=${order}&numPage=${
      page + 1
    }${getInputs}`;

    return this._http.get<BaseResponse>(requestUrl).pipe(
      map((resp: BaseResponse) => {
        resp.data.forEach(function (prov: EmpleoResponse) {
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
          prov.icEdit = getIcon("icEdit", "Editar empleo", true);
          prov.icDelete = getIcon("icDelete", "Eliminar empleo", true);
        });
        return resp;
      })
    );
  }

  EmpleoById(id: number): Observable<EmpleoById> {
    const requestUrl = `${env.api}${endpoint.EMPLEO_BY_ID}${id}`;
    return this._http.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp.data;
      })
    );
  }

  EmpleoRegister(empleo: EmpleoRequest): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.EMPLEO_REGISTER}`;
    const formDataEmpleo = this._builFormDataEmpleo(empleo);
    return this._http.post(requestUrl, formDataEmpleo).pipe(
      map((resp: BaseResponse) => {
        return resp;
      })
    );
  }

  EmpleoEdit(id: number, empleo: EmpleoRequest): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.EMPLEO_EDIT}${id}`;
    const formDataEmpleo = this._builFormDataEmpleo(empleo);
    return this._http.put<BaseResponse>(requestUrl, formDataEmpleo);
  }

  empleoRemove(id: number): Observable<void> {
    const requestUrl = `${env.api}${endpoint.EMPLEO_REMOVE}${id}`;
    return this._http.put(requestUrl, "").pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this._alert.success("Excelente", resp.message);
        }
      })
    );
  }

  private _builFormDataEmpleo(empleo: EmpleoRequest): FormData {
    const formData = new FormData();
    formData.append("titulo", empleo.titulo),
      formData.append("puesto", empleo.puesto),
      formData.append("descripcion", empleo.descripcion),
      formData.append("imagen", empleo.imagen),
      formData.append("estado", empleo.estado.toString());

    return formData;
  }
}
