import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { endpoint } from "@shared/apis/endpoint";
import { getIcon } from "@shared/functions/helpers";
import { BaseResponse } from "@shared/models/base-api-response.interface";
import { AlertService } from "@shared/services/alert.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment as env } from "src/environments/environment";
import { UsuarioRequest } from "../models/usuario-request.interface";
import {
  UsuarioById,
  UsuarioResponse,
} from "../models/usuario-response.interface";

@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  constructor(private _http: HttpClient, private _alert: AlertService) {}

  private logAction(
    action: string,
    id: number | null = null,
    params: any = null
  ): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.LOGS_REGISTER}`;
    const logData = {
      Usuario: `${localStorage.getItem('username')}`, 
      Modulo: "Usuario",
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
      endpoint.LIST_USUARIO
    }?records=${size}&sort=${sort}&order=${order}&numPage=${
      page + 1
    }${getInputs}`;

    return this._http.get<BaseResponse>(requestUrl).pipe(
      map((resp: BaseResponse) => {
        resp.data.forEach(function (prov: UsuarioResponse) {
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
          prov.icEdit = getIcon("icEdit", "Editar Usuario", true);
          prov.icDelete = getIcon("icDelete", "Eliminar Usuario", true);
        });
        return resp;
      })
    );
  }

  UsuarioById(id: number): Observable<UsuarioById> {
    const requestUrl = `${env.api}${endpoint.USUARIO_BY_ID}${id}`;
    return this._http.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp.data;
      })
    );
  }

  UsuarioRegister(usuario: UsuarioRequest): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.USUARIO_REGISTER}`;
    const formDataUsuario = this._builFormDataUsuario(usuario);
    return this._http.post(requestUrl, formDataUsuario).pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this.logAction("Registro", null, usuario);
        }
        return resp;
      })
    );
  }

  UsuarioEdit(id: number, usuario: UsuarioRequest): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.USUARIO_EDIT}${id}`;
    const formDataUsuario = this._builFormDataUsuario(usuario);
    return this._http.put<BaseResponse>(requestUrl, formDataUsuario).pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this.logAction("Edición", id, usuario);
        }
        return resp;
      })
    );;
  }

  UsuarioRemove(id: number): Observable<void> {
    const requestUrl = `${env.api}${endpoint.USUARIO_REMOVE}${id}`;
    return this._http.put(requestUrl, "").pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this.logAction("Eliminación", id);
          this._alert.success("Excelente", resp.message);
        }
      })
    );
  }

  private _builFormDataUsuario(usuario: UsuarioRequest): FormData {
    const formData = new FormData();
    formData.append("nombre", usuario.nombre),
      formData.append("apellido", usuario.apellido),
      formData.append("pass", usuario.pass),
      formData.append("correo", usuario.correo),
      formData.append("tipo", "Interno"),
      formData.append("cliente", usuario.cliente),
      formData.append("idRol", usuario.idRol.toString()),
      formData.append("imagen", usuario.imagen),
      formData.append("estado", usuario.estado.toString());
    formData.append("paginas", usuario.paginas);
    formData.append("nombreEmpresa", usuario.nombreEmpresa);
    formData.append("telefono", usuario.telefono);
    formData.append("direccion", usuario.direccion);
    formData.append("pais", usuario.pais);

    return formData;
  }
}
