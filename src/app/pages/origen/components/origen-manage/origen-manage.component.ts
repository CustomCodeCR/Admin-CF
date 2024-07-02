import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LogsRequest } from '@shared/models/logs-request.interface';
import { IconsService } from '@shared/services/icons.service';
import * as configs from "../../../../../static-data/configs";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from '@shared/services/alert.service';
import { OrigenService } from '../../services/origen.service';
import { LogsService } from '@shared/services/logs.service';

@Component({
  selector: 'vex-origen-manage',
  templateUrl: './origen-manage.component.html',
  styleUrls: ['./origen-manage.component.scss']
})
export class OrigenManageComponent implements OnInit {
  icClose = IconsService.prototype.getIcon("icClose");
  configs = configs;
  user = JSON.parse(localStorage.getItem('users'));

  form: FormGroup;

  initForm(): void {
    this.form = this._fb.group({
      id: [0, [Validators.required]],
      nombre: ["", [Validators.required]],
      imagen: ["", [Validators.required]],
      estado: ["", [Validators.required]],
    });
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _fb: FormBuilder,
    private _alert: AlertService,
    private _logsService: LogsService,
    private _origenService: OrigenService,
    public _dialogRef: MatDialogRef<OrigenManageComponent>
  ) {
    this.initForm();
   }

  ngOnInit(): void {
    if (this.data != null) {
      this.clientById(this.data.data.id);
    }
  }

  selectedImage(file: File) {
    this.form.get("imagen").setValue(file);
  }

  clientById(id: number): void {
    this._origenService.OrigenById(id).subscribe((resp) => {

      this.form.reset({
        id: resp.id,
        nombre: resp.nombre,
        imagen: resp.imagen,
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
    this._origenService
      .OrigenRegister(data)
      .subscribe((resp) => {
        if (resp.isSuccess) {
          this._alert.success("Excelente", resp.message);
          this._dialogRef.close(true);

          const log: LogsRequest = {
            usuario: `${this.user.family_name}`,
            modulo: "Origen",
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
    this._origenService
      .OrigenEdit(id, data)
      .subscribe((resp) => {
        if (resp.isSuccess) {
          this._alert.success("Excelente", resp.message);
          this._dialogRef.close(true);

          const log: LogsRequest = {
            usuario: `${this.user.family_name}`,
            modulo: "Origen",
            tipoMetodo: "Edición",
            parametros: JSON.stringify(data),
            estado: 1
          };
          this._logsService.LogRegister(log).subscribe();
        }
      });
  }
}
