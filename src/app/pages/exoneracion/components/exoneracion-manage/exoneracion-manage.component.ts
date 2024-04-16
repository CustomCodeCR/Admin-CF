import { Component, Inject, OnInit } from "@angular/core";
import { IconsService } from "@shared/services/icons.service";
import * as configs from "../../../../../static-data/configs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService } from "@shared/services/alert.service";
import { ExoneracionService } from "../../services/exoneracion.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { UsuarioSelectService } from "@shared/services/usuario-select.service";
import { SelectAutoComplete } from "@shared/models/select-autocomplete.interface";

@Component({
  selector: "vex-exoneracion-manage",
  templateUrl: "./exoneracion-manage.component.html",
  styleUrls: ["./exoneracion-manage.component.scss"],
})
export class ExoneracionManageComponent implements OnInit {
  icClose = IconsService.prototype.getIcon("icClose");
  configs = configs;
  status = ["En tramite", "Autorizada", "Vencida"];
  tipoExoneracion = ["Concreta", "Generica"];
  clientSelect: SelectAutoComplete[];

  form: FormGroup;

  initForm(): void {
    this.form = this._fb.group({
      id: [0, [Validators.required]],
      idtra: ["", [Validators.required]],
      cliente: ["", [Validators.required]],
      tipoExoneracion: ["", [Validators.required]],
      statusExoneracion: ["", [Validators.required]],
      producto: ["", [Validators.required]],
      categoria: ["", [Validators.required]],
      clasificacionArancelaria: ["", [Validators.required]],
      numeroSolicitud: [""],
      solicitud: [""],
      numeroAutorizacion: [""],
      autorizacion: [""],
      desde: [new Date()],
      hasta: [new Date()],
      descripcion: ["", [Validators.required]],
      estado: ["", [Validators.required]],
    });
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _fb: FormBuilder,
    private _clientSelectService: UsuarioSelectService,
    private _alert: AlertService,
    private _ExoneracionService: ExoneracionService,
    public _dialogRef: MatDialogRef<ExoneracionManageComponent>
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

  selectedImageWhsReceipt(file: File) {
    this.form.get("solicitud").setValue(file);
  }

  selectedImageDocumentoRegistro(file: File) {
    this.form.get("autorizacion").setValue(file);
  }

  clientById(id: number): void {
    this._ExoneracionService.ExoneracionById(id).subscribe((resp) => {
      const desde = new Date(resp.desde);
      const hasta = new Date(resp.hasta);

      this.form.reset({
        id: resp.id,
        idtra: resp.idtra,
        cliente: resp.cliente,
        tipoExoneracion: resp.tipoExoneracion,
        statusExoneracion: resp.statusExoneracion,
        producto: resp.producto,
        categoria: resp.categoria,
        clasificacionArancelaria: resp.clasificacionArancelaria,
        numeroSolicitud: resp.numeroSolicitud,
        solicitud: resp.solicitud,
        numeroAutorizacion: resp.numeroAutorizacion,
        autorizacion: resp.autorizacion,
        desde: desde,
        hasta: hasta,
        descripcion: resp.descripcion,
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
    this._ExoneracionService
      .ExoneracionRegister(this.form.value)
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
    this._ExoneracionService
      .ExoneracionEdit(id, this.form.value)
      .subscribe((resp) => {
        if (resp.isSuccess) {
          this._alert.success("Excelente", resp.message);
          this._dialogRef.close(true);
        }
      });
  }
}
