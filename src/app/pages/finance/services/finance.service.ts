import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse } from '@shared/models/base-api-response.interface';
import { AlertService } from '@shared/services/alert.service';
import { Observable } from 'rxjs';
import { endpoint } from "@shared/apis/endpoint";
import { environment as env } from "src/environments/environment";
import { FinanceById, FinanceResponse } from '../models/finance-response.interface';
import { map } from 'rxjs/operators';
import { getIcon } from '@shared/functions/helpers';
import { FinanceRequest } from '../models/finance-request.interface';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {

  constructor(private _http: HttpClient, private _alert: AlertService) { }

  GetAll(
    size: string,
    sort: string,
    order: string,
    page: number,
    getInputs: string
  ): Observable<BaseResponse> {
    const requestUrl = `${env.api}${
      endpoint.LIST_FINANCE
    }?records=${size}&sort=${sort}&order=${order}&numPage=${
      page + 1
    }${getInputs}`;

    return this._http.get<BaseResponse>(requestUrl).pipe(
      map((resp: BaseResponse) => {
        console.log(resp.data);
        resp.data.forEach(function (prov: FinanceResponse) {
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
          prov.icEdit = getIcon("icEdit", "Editar Finance", true);
          prov.icDelete = getIcon("icDelete", "Eliminar Finance", true);
        });
        return resp;
      })
    );
  }

  FinanceById(id: number): Observable<FinanceById> {
    const requestUrl = `${env.api}${endpoint.FINANCE_BY_ID}${id}`;
    return this._http.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp.data;
      })
    );
  }

  FinanceRegister(Finance: FinanceRequest): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.FINANCE_REGISTER}`;
    const formDataFinance = this._builFormDataFinance(Finance);
    return this._http.post(requestUrl, formDataFinance).pipe(
      map((resp: BaseResponse) => {
        return resp;
      })
    );
  }

  FinanceEdit(id: number, Finance: FinanceRequest): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.FINANCE_EDIT}${id}`;
    const formDataFinance = this._builFormDataFinance(Finance);
    return this._http.put<BaseResponse>(requestUrl, formDataFinance);
  }

  FinanceRemove(id: number): Observable<void> {
    const requestUrl = `${env.api}${endpoint.FINANCE_REMOVE}${id}`;
    return this._http.put(requestUrl, "").pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this._alert.success("Excelente", resp.message);
        }
      })
    );
  }

  private _builFormDataFinance(Finance: FinanceRequest): FormData {
    const formData = new FormData();
      formData.append("cliente", Finance.cliente),
      formData.append("estadoCuenta", Finance.estadoCuenta),
      formData.append("estado", Finance.estado.toString());

    return formData;
  }
}
