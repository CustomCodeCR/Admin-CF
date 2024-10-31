import { Component, Inject, OnInit } from "@angular/core";
import { IconsService } from "@shared/services/icons.service";
import * as configs from "../../../../../static-data/configs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService } from "@shared/services/alert.service";
import { BcfService } from "../../services/bcf.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { UsuarioSelectService } from "@shared/services/usuario-select.service";
import { SelectAutoComplete } from "@shared/models/select-autocomplete.interface";
import { LogsService } from "@shared/services/logs.service";
import { LogsRequest } from "@shared/models/logs-request.interface";

@Component({
  selector: "vex-bcf-manage",
  templateUrl: "./bcf-manage.component.html",
  styleUrls: ["./bcf-manage.component.scss"],
})
export class BcfManageComponent implements OnInit {
  icClose = IconsService.prototype.getIcon("icClose");
  configs = configs;
  clientSelect: SelectAutoComplete[];
  user = JSON.parse(localStorage.getItem("users"));

  form: FormGroup;

  initForm(): void {
    this.form = this._fb.group({
      id: [0, [Validators.required]],
      idtra: ["", [Validators.required]],
      cliente: [""],
      estado: ["1", [Validators.required]],
    });
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _fb: FormBuilder,
    private _clientSelectService: UsuarioSelectService,
    private _alert: AlertService,
    private _logsService: LogsService,
    private _BcfService: BcfService,
    public _dialogRef: MatDialogRef<BcfManageComponent>
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

  clientById(id: number): void {
    this._BcfService.BcfById(id).subscribe((resp) => {
      this.form.reset({
        id: resp.id,
        idtra: resp.idtra,
        cliente: resp.cliente,
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
    this._BcfService.BcfRegister(data).subscribe((resp) => {
      if (resp.isSuccess) {
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);

        const log: LogsRequest = {
          usuario: `${this.user.family_name}`,
          modulo: "Bcf",
          tipoMetodo: "Registro",
          parametros: JSON.stringify(data),
          estado: 1,
        };
        this._logsService.LogRegister(log).subscribe();
      } else {
        this._alert.warn("Atención", resp.message);
      }
    });
  }

  clientEdit(id: number, data): void {
    this._BcfService.BcfEdit(id, data).subscribe((resp) => {
      if (resp.isSuccess) {
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);

        const log: LogsRequest = {
          usuario: `${this.user.family_name}`,
          modulo: "Bcf",
          tipoMetodo: "Edición",
          parametros: JSON.stringify(data),
          estado: 1,
        };
        this._logsService.LogRegister(log).subscribe();
      }
    });
  }

  getFormattedDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // +1 porque enero es 0
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
}
