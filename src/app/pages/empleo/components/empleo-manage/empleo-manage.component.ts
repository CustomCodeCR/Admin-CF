import { Component, Inject, OnInit } from "@angular/core";
import { IconsService } from "@shared/services/icons.service";
import * as configs from "../../../../../static-data/configs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService } from "@shared/services/alert.service";
import { EmpleoService } from "../../services/empleo.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "vex-empleo-manage",
  templateUrl: "./empleo-manage.component.html",
  styleUrls: ["./empleo-manage.component.scss"],
})
export class EmpleoManageComponent implements OnInit {
  icClose = IconsService.prototype.getIcon("icClose");
  configs = configs;

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

    if (id > 0) {
      this.clientEdit(id);
    } else {
      this.clientRegister();
    }
  }

  clientRegister(): void {
    this._empleoService.EmpleoRegister(this.form.value).subscribe((resp) => {
      if (resp.isSuccess) {
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);
      } else {
        this._alert.warn("Atención", resp.message);
      }
    });
  }

  clientEdit(id: number): void {
    this._empleoService.EmpleoEdit(id, this.form.value).subscribe((resp) => {
      if (resp.isSuccess) {
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);
      }
    });
  }
}
