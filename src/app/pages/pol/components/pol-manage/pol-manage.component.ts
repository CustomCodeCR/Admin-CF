import { Component, Inject, OnInit } from '@angular/core';
import { IconsService } from '@shared/services/icons.service';
import * as configs from "../../../../../static-data/configs";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from '@shared/services/alert.service';
import { LogsService } from '@shared/services/logs.service';
import { PolService } from '../../services/pol.service';
import { LogsRequest } from '@shared/models/logs-request.interface';

@Component({
  selector: 'vex-pol-manage',
  templateUrl: './pol-manage.component.html',
  styleUrls: ['./pol-manage.component.scss']
})
export class PolManageComponent implements OnInit {
  icClose = IconsService.prototype.getIcon("icClose");
  configs = configs;
  user = JSON.parse(localStorage.getItem('users'));

  form: FormGroup;

  initForm(): void {
    this.form = this._fb.group({
      id: [0, [Validators.required]],
      nombre: ["", [Validators.required]],
      whs: ["", [Validators.required]],
      estado: ["", [Validators.required]],
    });
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _fb: FormBuilder,
    private _alert: AlertService,
    private _logsService: LogsService,
    private _polService: PolService,
    public _dialogRef: MatDialogRef<PolManageComponent>
  ) {
    this.initForm();
   }

  ngOnInit(): void {
    if (this.data != null) {
      this.clientById(this.data.data.id);
    }
  }

  clientById(id: number): void {
    this._polService.PolById(id).subscribe((resp) => {

      this.form.reset({
        id: resp.id,
        nombre: resp.nombre,
        whs: resp.whs,
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
    this._polService
      .PolRegister(data)
      .subscribe((resp) => {
        if (resp.isSuccess) {
          this._alert.success("Excelente", resp.message);
          this._dialogRef.close(true);

          const log: LogsRequest = {
            usuario: `${this.user.family_name}`,
            modulo: "POL",
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
    this._polService
      .PolEdit(id, data)
      .subscribe((resp) => {
        if (resp.isSuccess) {
          this._alert.success("Excelente", resp.message);
          this._dialogRef.close(true);

          const log: LogsRequest = {
            usuario: `${this.user.family_name}`,
            modulo: "POL",
            tipoMetodo: "Edición",
            parametros: JSON.stringify(data),
            estado: 1
          };
          this._logsService.LogRegister(log).subscribe();
        }
      });
  }
}
