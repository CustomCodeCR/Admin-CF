import { Component, Inject, OnInit } from "@angular/core";
import { IconsService } from "@shared/services/icons.service";
import * as configs from "../../../../../static-data/configs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService } from "@shared/services/alert.service";
import { MultimediaService } from "../../services/multimedia.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { LogsService } from "@shared/services/logs.service";
import { LogsRequest } from "@shared/models/logs-request.interface";

@Component({
  selector: "vex-multimedia-manage",
  templateUrl: "./multimedia-manage.component.html",
  styleUrls: ["./multimedia-manage.component.scss"],
})
export class MultimediaManageComponent implements OnInit {
  icClose = IconsService.prototype.getIcon("icClose");
  configs = configs;

  form: FormGroup;
  user = JSON.parse(localStorage.getItem('users'));

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _fb: FormBuilder,
    private _alert: AlertService,
    private _MultimediaService: MultimediaService,
    private _logsService: LogsService,
    public _dialogRef: MatDialogRef<MultimediaManageComponent>
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    if (this.data != null) {
      this.clientById(this.data.data.id);
    }
  }

  initForm(): void {
    this.form = this._fb.group({
      id: [0, [Validators.required]],
      nombre: ["", [Validators.required]],
      multimedia: [""],
      estado: ["", [Validators.required]],
    });
  }

  selectedImage(file: File) {
    this.form.get("multimedia").setValue(file);
  }

  clientById(id: number): void {
    this._MultimediaService.MultimediaById(id).subscribe((resp) => {

      this.form.reset({
        id: resp.id,
        nombre: resp.nombre,
        multimedia: resp.multimedia,
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
    this._MultimediaService.MultimediaRegister(data).subscribe((resp) => {
      if (resp.isSuccess) {
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);

        const log: LogsRequest = {
          usuario: `${this.user.family_name}`,
          modulo: "Multimedia",
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
    this._MultimediaService.MultimediaEdit(id, data).subscribe((resp) => {
      if (resp.isSuccess) {
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);

        const log: LogsRequest = {
          usuario: `${this.user.family_name}`,
          modulo: "Multimedia",
          tipoMetodo: "Edición",
          parametros: JSON.stringify(data),
          estado: 1
        };
        this._logsService.LogRegister(log).subscribe();
      }
    });
  }
}