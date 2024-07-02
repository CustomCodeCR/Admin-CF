import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LogsRequest } from '@shared/models/logs-request.interface';
import { IconsService } from '@shared/services/icons.service';
import { PodService } from '../../services/pod.service';
import { AlertService } from '@shared/services/alert.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LogsService } from '@shared/services/logs.service';
import * as configs from "../../../../../static-data/configs";

@Component({
  selector: 'vex-pod-manage',
  templateUrl: './pod-manage.component.html',
  styleUrls: ['./pod-manage.component.scss']
})
export class PodManageComponent implements OnInit {
  icClose = IconsService.prototype.getIcon("icClose");
  configs = configs;
  user = JSON.parse(localStorage.getItem('users'));

  form: FormGroup;

  initForm(): void {
    this.form = this._fb.group({
      id: [0, [Validators.required]],
      nombre: ["", [Validators.required]],
      estado: ["", [Validators.required]],
    });
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _fb: FormBuilder,
    private _alert: AlertService,
    private _logsService: LogsService,
    private _podService: PodService,
    public _dialogRef: MatDialogRef<PodManageComponent>
  ) {
    this.initForm();
   }

  ngOnInit(): void {
    if (this.data != null) {
      this.clientById(this.data.data.id);
    }
  }

  clientById(id: number): void {
    this._podService.PodById(id).subscribe((resp) => {

      this.form.reset({
        id: resp.id,
        nombre: resp.nombre,
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
    this._podService
      .PodRegister(data)
      .subscribe((resp) => {
        if (resp.isSuccess) {
          this._alert.success("Excelente", resp.message);
          this._dialogRef.close(true);

          const log: LogsRequest = {
            usuario: `${this.user.family_name}`,
            modulo: "POD",
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
    this._podService
      .PodEdit(id, data)
      .subscribe((resp) => {
        if (resp.isSuccess) {
          this._alert.success("Excelente", resp.message);
          this._dialogRef.close(true);

          const log: LogsRequest = {
            usuario: `${this.user.family_name}`,
            modulo: "POD",
            tipoMetodo: "Edición",
            parametros: JSON.stringify(data),
            estado: 1
          };
          this._logsService.LogRegister(log).subscribe();
        }
      });
  }
}
