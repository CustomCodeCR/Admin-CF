import { Component, Inject, OnInit } from "@angular/core";
import { IconsService } from "@shared/services/icons.service";
import * as configs from "../../../../../static-data/configs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService } from "@shared/services/alert.service";
import { EmpleoService } from "../../services/empleo.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { LogsService } from "@shared/services/logs.service";
import { LogsRequest } from "@shared/models/logs-request.interface";


@Component({
  selector: "vex-empleo-manage",
  templateUrl: "./empleo-manage.component.html",
  styleUrls: ["./empleo-manage.component.scss"],
})
export class EmpleoManageComponent implements OnInit {
  icClose = IconsService.prototype.getIcon("icClose");
  configs = configs;
  user = JSON.parse(localStorage.getItem('users'));

  form: FormGroup;

  initForm(): void {
    this.form = this._fb.group({
      id: [0, [Validators.required]],
      titulo: ["", [Validators.required]],
      puesto: ["", [Validators.required]],
      descripcion: [""],
      imagen: [""],
      estado: ["", [Validators.required]],
    });
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _fb: FormBuilder,
    private _alert: AlertService,
    private _empleoService: EmpleoService,
    private _logsService: LogsService,
    public _dialogRef: MatDialogRef<EmpleoManageComponent>
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
    this._empleoService.EmpleoById(id).subscribe((resp) => {
      this.form.reset({
        id: resp.id,
        titulo: resp.titulo,
        puesto: resp.puesto,
        descripcion: resp.descripcion,
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
    const empleoData = this.form.value;

    if (id > 0) {
      this.clientEdit(id, empleoData);
    } else {
      this.clientRegister(empleoData);
    }
  }

  clientRegister(empleoData): void {
    this._empleoService.EmpleoRegister(empleoData).subscribe((resp) => {
      if (resp.isSuccess) {
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);

        const log: LogsRequest = {
          usuario: `${this.user.family_name}`,
          modulo: "Empleo",
          tipoMetodo: "Registro",
          parametros: JSON.stringify(empleoData),
          estado: 1
        };
        this._logsService.LogRegister(log).subscribe();
      } else {
        this._alert.warn("Atención", resp.message);
      }
    });
  }

  clientEdit(id: number, empleoData): void {
    this._empleoService.EmpleoEdit(id, empleoData).subscribe((resp) => {
      if (resp.isSuccess) {
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);

        const log: LogsRequest = {
          usuario: `${this.user.family_name}`,
          modulo: "Empleo",
          tipoMetodo: "Edición",
          parametros: JSON.stringify(empleoData),
          estado: 1
        };
        this._logsService.LogRegister(log).subscribe();
      }
    });
  }
}
