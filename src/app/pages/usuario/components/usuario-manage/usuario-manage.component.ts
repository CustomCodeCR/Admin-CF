import { Component, Inject, OnInit } from "@angular/core";
import { IconsService } from "@shared/services/icons.service";
import * as configs from "../../../../../static-data/configs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService } from "@shared/services/alert.service";
import { UsuarioService } from "../../services/usuario.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "vex-usuario-manage",
  templateUrl: "./usuario-manage.component.html",
  styleUrls: ["./usuario-manage.component.scss"],
})
export class UsuarioManageComponent implements OnInit {
  icClose = IconsService.prototype.getIcon("icClose");
  configs = configs;
  rolList = [
    { key: "1", name: "Perfil" },
    { key: "2", name: "Tramites" },
    { key: "3", name: "Transporte Internacional" },
    { key: "4", name: "Agenciamiento Aduanal" },
    { key: "5", name: "Shedules" },
    { key: "6", name: "Itinerarios" },
    { key: "7", name: "Tracking" },
    { key: "8", name: "Quote" },
    { key: "9", name: "Cotización" },
    { key: "10", name: "Tarifarios" },
    { key: "11", name: "My Documentation" },
    { key: "12", name: "Exoneraciones" },
    { key: "13", name: "WHS" },
    { key: "14", name: "My Finance" },
    { key: "15", name: "Directorio Interno" },
  ];
  isAdmin: boolean = false;

  form: FormGroup;

  initForm(): void {
    this.form = this._fb.group({
      id: [0, [Validators.required]],
      nombre: ["", [Validators.required]],
      apellido: ["", [Validators.required]],
      nombreEmpresa: ["", [Validators.required]],
      pass: [""],
      correo: ["", [Validators.required]],
      tipo: [""],
      cliente: [""],
      idRol: ["", [Validators.required]],
      telefono: ["", [Validators.required]],
      direccion: ["", [Validators.required]],
      pais: ["", [Validators.required]],
      paginas: ["1"],
      imagen: [""],
      estado: ["", [Validators.required]],
    });
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _fb: FormBuilder,
    private _alert: AlertService,
    private _usuarioService: UsuarioService,
    public _dialogRef: MatDialogRef<UsuarioManageComponent>
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    if (this.data != null) {
      this.clientById(this.data.data.id);
    }
    const rol = this.form.get("idRol").value;
    this.isAdmin = rol !== 1;
  }

  onRoleChange(event: any): void {
    const selectedRoleId = event.value;
    this.isAdmin = selectedRoleId !== 1;
  }

  selectedImage(file: File) {
    this.form.get("imagen").setValue(file);
  }

  markMatchingCheckboxes(): void {
    const privilegiosControl = this.form.get("paginas");
    const selectedPrivilegios = privilegiosControl.value || "";

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach((checkbox: any) => {
      if (selectedPrivilegios.includes(checkbox.value)) {
        checkbox.checked = true;
      }
    });
  }

  onChange(e: any) {
    const privilegiosControl = this.form.get("paginas");

    let selectedPrivilegios = privilegiosControl.value || "";

    if (e.target.checked) {
      if (!selectedPrivilegios.includes(e.target.value)) {
        selectedPrivilegios +=
          (selectedPrivilegios.length > 0 ? "," : "") + e.target.value;
      }
    } else {
      selectedPrivilegios = selectedPrivilegios
        .split(",")
        .filter((value: string) => value !== e.target.value)
        .join(",");
    }

    console.log(selectedPrivilegios);
    privilegiosControl.setValue(selectedPrivilegios);
  }

  clientById(id: number): void {
    this._usuarioService.UsuarioById(id).subscribe((resp) => {
      this.form.reset({
        id: resp.id,
        nombre: resp.nombre,
        apellido: resp.apellido,
        nombreEmpresa: resp.nombreEmpresa,
        correo: resp.correo,
        cliente: resp.cliente,
        idRol: resp.idRol,
        telefono: resp.telefono,
        direccion: resp.direccion,
        pais: resp.pais,
        paginas: resp.paginas.split(","),
        imagen: resp.imagen,
        estado: resp.estado,
      });
      this.isAdmin = resp.idRol !== 1;
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
      console.log(this.form.value);
    }
  }

  clientRegister(): void {
    this._usuarioService.UsuarioRegister(this.form.value).subscribe((resp) => {
      if (resp.isSuccess) {
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);
      } else {
        this._alert.warn("Atención", resp.message);
      }
    });
  }

  clientEdit(id: number): void {
    this._usuarioService.UsuarioEdit(id, this.form.value).subscribe((resp) => {
      if (resp.isSuccess) {
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);
      }
    });
  }
}
