import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { endpoint } from '@shared/apis/endpoint';
import { BaseResponse } from '@shared/models/base-api-response.interface';
import { AlertService } from '@shared/services/alert.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment as env } from "src/environments/environment";
import { ExoneracionById, ExoneracionResponse } from '../models/exoneracion-response.interface';
import { getIcon } from '@shared/functions/helpers';
import { ExoneracionRequest } from '../models/exoneracion-request.interface';

@Injectable({
  providedIn: 'root'
})
export class ExoneracionService {

  constructor(private _http: HttpClient, private _alert: AlertService) {}

  GetAll(
    size: string,
    sort: string,
    order: string,
    page: number,
    getInputs: string
  ): Observable<BaseResponse> {
    const requestUrl = `${env.api}${
      endpoint.LIST_EXONERACION
    }?records=${size}&sort=${sort}&order=${order}&numPage=${
      page + 1
    }${getInputs}`;

    return this._http.get<BaseResponse>(requestUrl).pipe(
      map((resp: BaseResponse) => {
        console.log(resp.data);
        resp.data.forEach(function (prov: ExoneracionResponse) {
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
          prov.icEdit = getIcon("icEdit", "Editar Exoneracion", true);
          prov.icDelete = getIcon("icDelete", "Eliminar Exoneracion", true);
        });
        return resp;
      })
    );
  }

  ExoneracionById(id: number): Observable<ExoneracionById> {
    const requestUrl = `${env.api}${endpoint.EXONERACION_BY_ID}${id}`;
    return this._http.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp.data;
      })
    );
  }

  ExoneracionRegister(Exoneracion: ExoneracionRequest): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.EXONERACION_REGISTER}`;
    const formDataExoneracion = this._builFormDataExoneracion(Exoneracion);
    return this._http.post(requestUrl, formDataExoneracion).pipe(
      map((resp: BaseResponse) => {
        return resp;
      })
    );
  }

  ExoneracionEdit(id: number, Exoneracion: ExoneracionRequest): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.EXONERACION_EDIT}${id}`;
    const formDataExoneracion = this._builFormDataExoneracion(Exoneracion);
    return this._http.put<BaseResponse>(requestUrl, formDataExoneracion);
  }

  ExoneracionRemove(id: number): Observable<void> {
    const requestUrl = `${env.api}${endpoint.EXONERACION_REMOVE}${id}`;
    return this._http.put(requestUrl, "").pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this._alert.success("Excelente", resp.message);
        }
      })
    );
  }

  private _builFormDataExoneracion(Exoneracion: ExoneracionRequest): FormData {
    const formData = new FormData();
    formData.append("idtra", Exoneracion.idtra),
      formData.append("cliente", Exoneracion.cliente),
      formData.append("tipoExoneracion", Exoneracion.tipoExoneracion),
      formData.append("statusExoneracion", Exoneracion.statusExoneracion),
      formData.append("producto", Exoneracion.producto),
      formData.append("categoria", Exoneracion.categoria),
      formData.append("clasificacionArancelaria", Exoneracion.clasificacionArancelaria),
      formData.append("numeroSolicitud", Exoneracion.numeroSolicitud),
      formData.append("solicitud", Exoneracion.solicitud),
      formData.append("numeroAutorizacion", Exoneracion.numeroAutorizacion),
      formData.append("autorizacion", Exoneracion.autorizacion),
      formData.append("desde", Exoneracion.desde.toString()),
      formData.append("hasta", Exoneracion.hasta.toString()),
      formData.append("descripcion", Exoneracion.descripcion),
      formData.append("estado", Exoneracion.estado.toString());

    return formData;
  }
}
