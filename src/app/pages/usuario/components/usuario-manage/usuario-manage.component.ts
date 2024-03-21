import { Component, Inject, OnInit } from "@angular/core";
import { IconsService } from "@shared/services/icons.service";
import * as configs from "../../../../../static-data/configs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService } from "@shared/services/alert.service";
import { UsuarioService } from "../../services/usuario.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DocumentTypeService } from "@shared/services/document-type.service";

@Component({
  selector: "vex-usuario-manage",
  templateUrl: "./usuario-manage.component.html",
  styleUrls: ["./usuario-manage.component.scss"],
})
export class UsuarioManageComponent implements OnInit {
  icClose = IconsService.prototype.getIcon("icClose");
  configs = configs;

  form: FormGroup;

  initForm(): void {
    this.form = this._fb.group({
      id: [0, [Validators.required]],
      nombre: ["", [Validators.required]],
      apellido: ["", [Validators.required]],
      pass: [""],
      correo: ["", [Validators.required]],
      tipo: [""],
      cliente: [""],
      idRol: ["", [Validators.required]],
      imagen: [""],
      estado: ["", [Validators.required]],
    });
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _fb: FormBuilder,
    private _alert: AlertService,
    private _usuarioService: UsuarioService,
    public _dialogRef: MatDialogRef<UsuarioManageComponent>,
    private _documentTypeService: DocumentTypeService
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
    this._usuarioService.UsuarioById(id).subscribe((resp) => {
      this.form.reset({
        id: resp.id,
        nombre: resp.nombre,
        apellido: resp.apellido,
        correo: resp.correo,
        cliente: resp.cliente,
        idRol: resp.idRol,
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
    this._usuarioService
      .UsuarioRegister(this.form.value)
      .subscribe((resp) => {
        if (resp.isSuccess) {
          this._alert.success("Excelente", resp.message);
          this._dialogRef.close(true);
        } else {
          this._alert.warn("Atención", resp.message);
        }
      });
  }

  clientEdit(id: number): void {
    this._usuarioService
      .UsuarioEdit(id, this.form.value)
      .subscribe((resp) => {
        if (resp.isSuccess) {
          this._alert.success("Excelente", resp.message);
          this._dialogRef.close(true);
        }
      });
  }
}
