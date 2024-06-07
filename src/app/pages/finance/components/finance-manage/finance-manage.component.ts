import { Component, Inject, OnInit } from "@angular/core";
import { IconsService } from "@shared/services/icons.service";
import * as configs from "../../../../../static-data/configs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService } from "@shared/services/alert.service";
import { FinanceService } from "../../services/finance.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { UsuarioSelectService } from "@shared/services/usuario-select.service";
import { SelectAutoComplete } from "@shared/models/select-autocomplete.interface";
import { LogsService } from "@shared/services/logs.service";
import { LogsRequest } from "@shared/models/logs-request.interface";

@Component({
  selector: "vex-finance-manage",
  templateUrl: "./finance-manage.component.html",
  styleUrls: ["./finance-manage.component.scss"],
})
export class FinanceManageComponent implements OnInit {
  icClose = IconsService.prototype.getIcon("icClose");
  configs = configs;
  clientSelect: SelectAutoComplete[];
  user = JSON.parse(localStorage.getItem('users'));

  form: FormGroup;

  initForm(): void {
    this.form = this._fb.group({
      id: [0, [Validators.required]],
      cliente: ["", [Validators.required]],
      estadoCuenta: ["", [Validators.required]],
      estado: ["", [Validators.required]],
    });
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _fb: FormBuilder,
    private _clientSelectService: UsuarioSelectService,
    private _alert: AlertService,
    private _logsService: LogsService,
    private _FinanceService: FinanceService,
    public _dialogRef: MatDialogRef<FinanceManageComponent>
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.listSelectClients();
    if (this.data.data != null) {
      this.clientById(this.data.data.id);
    }
  }

  listSelectClients(): void {
    this._clientSelectService
      .listSelectUsuarios()
      .subscribe((resp) => (this.clientSelect = resp));
  }

  selectedImageWhsReceipt(file: File) {
    this.form.get("estadoCuenta").setValue(file);
  }

  clientById(id: number): void {
    this._FinanceService.FinanceById(id).subscribe((resp) => {
      this.form.reset({
        id: resp.id,
        cliente: resp.cliente,
        FinanceReceipt: resp.estadoCuenta,
        estado: resp.estado,
      });
    });
  }

  clientSave(): void {
    if (this.form.invalid) {
      return Object.values(this.form.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    const id = this.form.get("id").value;
    const data = this.form.value;

    if (id > 0) {
      this.clientEdit(id, data);
    } else {
      this.clientRegister(data);
    }
  }

  clientRegister(data): void {
    this._FinanceService.FinanceRegister(data).subscribe((resp) => {
      if (resp.isSuccess) {
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);

        const log: LogsRequest = {
          usuario: `${this.user.family_name}`,
          modulo: "Finance",
          tipoMetodo: "Registro",
          parametros: JSON.stringify(data),
          estado: 1
        };
        this._logsService.LogRegister(log).subscribe();
      } else {
        this._alert.warn("Atención", resp.message);
      }
    });
  }

  clientEdit(id: number, data): void {
    this._FinanceService.FinanceEdit(id, data).subscribe((resp) => {
      if (resp.isSuccess) {
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);

        const log: LogsRequest = {
          usuario: `${this.user.family_name}`,
          modulo: "Finance",
          tipoMetodo: "Edición",
          parametros: JSON.stringify(data),
          estado: 1
        };
        this._logsService.LogRegister(log).subscribe();
      }
    });
  }
}
