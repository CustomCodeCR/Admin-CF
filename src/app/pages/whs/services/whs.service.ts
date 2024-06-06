import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { endpoint } from "@shared/apis/endpoint";
import { getIcon } from "@shared/functions/helpers";
import { BaseResponse } from "@shared/models/base-api-response.interface";
import { AlertService } from "@shared/services/alert.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment as env } from "src/environments/environment";
import { WhsRequest } from "../models/whs-request.interface";
import { WhsById, WhsResponse } from "../models/whs-response.interface";

@Injectable({
  providedIn: "root",
})
export class WhsService {
  constructor(private _http: HttpClient, private _alert: AlertService) {}

  private logAction(
    action: string,
    id: number | null = null,
    params: any = null
  ): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.LOGS_REGISTER}`;
    const logData = {
      Usuario: `${localStorage.getItem('username')}`, 
      Modulo: "WHS",
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
      endpoint.LIST_WHS
    }?records=${size}&sort=${sort}&order=${order}&numPage=${
      page + 1
    }${getInputs}`;

    return this._http.get<BaseResponse>(requestUrl).pipe(
      map((resp: BaseResponse) => {
        console.log(resp.data);
        resp.data.forEach(function (prov: WhsResponse) {
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
          prov.icEdit = getIcon("icEdit", "Editar Whs", true);
          prov.icDelete = getIcon("icDelete", "Eliminar Whs", true);
        });
        return resp;
      })
    );
  }

  WhsById(id: number): Observable<WhsById> {
    const requestUrl = `${env.api}${endpoint.WHS_BY_ID}${id}`;
    return this._http.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp.data;
      })
    );
  }

  WhsRegister(Whs: WhsRequest): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.WHS_REGISTER}`;
    const formDataWhs = this._builFormDataWhs(Whs);
    return this._http.post(requestUrl, formDataWhs).pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this.logAction("Registro", null, Whs);
        }
        return resp;
      })
    );
  }

  WhsEdit(id: number, Whs: WhsRequest): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.WHS_EDIT}${id}`;
    const formDataWhs = this._builFormDataWhs(Whs);
    return this._http.put<BaseResponse>(requestUrl, formDataWhs).pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this.logAction("Edición", id, Whs);
        }
        return resp;
      })
    );;
  }

  WhsRemove(id: number): Observable<void> {
    const requestUrl = `${env.api}${endpoint.WHS_REMOVE}${id}`;
    return this._http.put(requestUrl, "").pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this.logAction("Eliminación", id);
          this._alert.success("Excelente", resp.message);
        }
      })
    );
  }

  private _builFormDataWhs(Whs: WhsRequest): FormData {
    const formData = new FormData();
    formData.append("idtra", Whs.idtra),
      formData.append("numeroWHS", Whs.numeroWHS),
      formData.append("cliente", Whs.cliente),
      formData.append("tipoRegistro", Whs.tipoRegistro),
      formData.append("po", Whs.po),
      formData.append("statusWHS", Whs.statusWHS),
      formData.append("pol", Whs.pol),
      formData.append("pod", Whs.pod),
      formData.append("detalle", Whs.detalle),
      formData.append("cantidadBultos", Whs.cantidadBultos),
      formData.append("tipoBultos", Whs.tipoBultos),
      formData.append("vinculacionOtroRegistro", Whs.vinculacionOtroRegistro),
      formData.append("whsReceipt", Whs.whsReceipt),
      formData.append("documentoregistro", Whs.documentoregistro),
      formData.append("imagen1", Whs.imagen1),
      formData.append("imagen2", Whs.imagen2),
      formData.append("imagen3", Whs.imagen3),
      formData.append("imagen4", Whs.imagen4),
      formData.append("imagen5", Whs.imagen5),
      formData.append("estado", Whs.estado.toString());

    return formData;
  }
}
