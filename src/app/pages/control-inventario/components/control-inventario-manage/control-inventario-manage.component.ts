import { Component, Inject, OnInit } from "@angular/core";
import { IconsService } from "@shared/services/icons.service";
import * as configs from "../../../../../static-data/configs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService } from "@shared/services/alert.service";
import { ControlInventarioService } from "../../services/control-inventario.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { UsuarioSelectService } from "@shared/services/usuario-select.service";
import { SelectAutoComplete } from "@shared/models/select-autocomplete.interface";
import { LogsService } from "@shared/services/logs.service";
import { LogsRequest } from "@shared/models/logs-request.interface";
import { PolService } from "@shared/services/pol.service";

@Component({
  selector: "vex-control-inventario-manage",
  templateUrl: "./control-inventario-manage.component.html",
  styleUrls: ["./control-inventario-manage.component.scss"],
})
export class ControlInventarioManageComponent implements OnInit {
  icClose = IconsService.prototype.getIcon("icClose");
  configs = configs;
  pol = [];
  clientSelect: SelectAutoComplete[];

  form: FormGroup;
  user = JSON.parse(localStorage.getItem('users'));

  initForm(): void {
    this.form = this._fb.group({
      id: [0, [Validators.required]],
      cliente: ["", [Validators.required]],
      pol: ["", [Validators.required]],
      vinculacionOtroRegistro: [""],
      controlInventario: [""],
      estado: ["", [Validators.required]],
    });
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _fb: FormBuilder,
    private _clientSelectService: UsuarioSelectService,
    private _alert: AlertService,
    private _ControlInventarioService: ControlInventarioService,
    private _logsService: LogsService,
    public _dialogRef: MatDialogRef<ControlInventarioManageComponent>
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.listSelectClients();
    if (this.data.data != null) {
      this.clientById(this.data.data.id);
    }

    this.pol = [this.data.parametro.replace(/-/g, ' ')]
  }

  listSelectClients(): void {
    this._clientSelectService
      .listSelectUsuarios()
      .subscribe((resp) => (this.clientSelect = resp));
  }

  selectedControlInventario(file: File) {
    this.form.get("controlInventario").setValue(file);
  }

  clientById(id: number): void {
    this._ControlInventarioService.ControlInventarioById(id).subscribe((resp) => {
      this.form.reset({
        id: resp.id,
        cliente: resp.cliente,
        pol: resp.pol,
        ControlInventario: resp.controlInventario,
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
    this._ControlInventarioService.ControlInventarioRegister(data).subscribe((resp) => {
      if (resp.isSuccess) {
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);

        const log: LogsRequest = {
          usuario: `${this.user.family_name}`,
          modulo: "ControlInventario",
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
    this._ControlInventarioService.ControlInventarioEdit(id, data).subscribe((resp) => {
      if (resp.isSuccess) {
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);

        const log: LogsRequest = {
          usuario: `${this.user.family_name}`,
          modulo: "ControlInventario",
          tipoMetodo: "Edición",
          parametros: JSON.stringify(data),
          estado: 1
        };
        this._logsService.LogRegister(log).subscribe();
      }
    });
  }
}
