import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { endpoint } from "@shared/apis/endpoint";
import { getIcon } from "@shared/functions/helpers";
import { BaseResponse } from "@shared/models/base-api-response.interface";
import { AlertService } from "@shared/services/alert.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment as env } from "src/environments/environment";
import { ControlInventarioRequest } from "../models/control-inventario-request.interface";
import { ControlInventarioById, ControlInventarioResponse } from "../models/control-inventario-response.interface";

@Injectable({
  providedIn: "root",
})
export class ControlInventarioService {
  constructor(private _http: HttpClient, private _alert: AlertService) {}

  private logAction(
    action: string,
    id: number | null = null,
    params: any = null
  ): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.LOGS_REGISTER}`;
    const logData = {
      Usuario: `${localStorage.getItem('username')}`, 
      Modulo: "ControlInventario",
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
      endpoint.LIST_CONTROL_INVENTARIO
    }?records=${size}&sort=${sort}&order=${order}&numPage=${
      page + 1
    }${getInputs}`;

    return this._http.get<BaseResponse>(requestUrl).pipe(
      map((resp: BaseResponse) => {
        console.log(resp.data);
        resp.data.forEach(function (prov: ControlInventarioResponse) {
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
          prov.icEdit = getIcon("icEdit", "Editar ControlInventario", true);
          prov.icDelete = getIcon("icDelete", "Eliminar ControlInventario", true);
        });
        return resp;
      })
    );
  }

  ControlInventarioById(id: number): Observable<ControlInventarioById> {
    const requestUrl = `${env.api}${endpoint.CONTROL_INVENTARIO_BY_ID}${id}`;
    return this._http.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp.data;
      })
    );
  }

  ControlInventarioRegister(ControlInventario: ControlInventarioRequest): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.CONTROL_INVENTARIO_REGISTER}`;
    const formDataControlInventario = this._builFormDataControlInventario(ControlInventario);
    return this._http.post(requestUrl, formDataControlInventario).pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this.logAction("Registro", null, ControlInventario);
        }
        return resp;
      })
    );
  }

  ControlInventarioEdit(id: number, ControlInventario: ControlInventarioRequest): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.CONTROL_INVENTARIO_EDIT}${id}`;
    const formDataControlInventario = this._builFormDataControlInventario(ControlInventario);
    return this._http.put<BaseResponse>(requestUrl, formDataControlInventario).pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this.logAction("Edición", id, ControlInventario);
        }
        return resp;
      })
    );;
  }

  ControlInventarioRemove(id: number): Observable<void> {
    const requestUrl = `${env.api}${endpoint.CONTROL_INVENTARIO_REMOVE}${id}`;
    return this._http.put(requestUrl, "").pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this.logAction("Eliminación", id);
          this._alert.success("Excelente", resp.message);
        }
      })
    );
  }

  private _builFormDataControlInventario(ControlInventario: ControlInventarioRequest): FormData {
    const formData = new FormData();
      formData.append("cliente", ControlInventario.cliente),
      formData.append("pol", ControlInventario.pol),
      formData.append("controlInventario", ControlInventario.controlInventario),
      formData.append("estado", ControlInventario.estado.toString());
    return formData;
  }
}
