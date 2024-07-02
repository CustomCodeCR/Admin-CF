import { Component, Inject, OnInit } from "@angular/core";
import { IconsService } from "@shared/services/icons.service";
import * as configs from "../../../../../static-data/configs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService } from "@shared/services/alert.service";
import { WhsService } from "../../services/whs.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { UsuarioSelectService } from "@shared/services/usuario-select.service";
import { SelectAutoComplete } from "@shared/models/select-autocomplete.interface";
import { LogsService } from "@shared/services/logs.service";
import { LogsRequest } from "@shared/models/logs-request.interface";
import { PodService } from "@shared/services/pod.service";

@Component({
  selector: "vex-whs-manage",
  templateUrl: "./whs-manage.component.html",
  styleUrls: ["./whs-manage.component.scss"],
})
export class WhsManageComponent implements OnInit {
  icClose = IconsService.prototype.getIcon("icClose");
  configs = configs;
  pol = [
    "Ciudad Guatemala, Guatemala",
    "San Pedro Sula, Honduras",
    "Miami, USA",
    "CFZ, Panama",
    "SJO, CRC",
    "Ningbo, China",
    "Shanghai, China",
  ];
  status = ["En WHS", "Preparando para Envio", "Salida"];
  tipoRegistro = ["Ingreso", "Salida"];
  clientSelect: SelectAutoComplete[];
  podSelect: SelectAutoComplete[];

  form: FormGroup;
  user = JSON.parse(localStorage.getItem('users'));

  initForm(): void {
    this.form = this._fb.group({
      id: [0, [Validators.required]],
      idtra: ["", [Validators.required]],
      numeroWHS: ["", [Validators.required]],
      cliente: ["", [Validators.required]],
      tipoRegistro: ["", [Validators.required]],
      po: ["", [Validators.required]],
      statusWHS: ["", [Validators.required]],
      pol: ["", [Validators.required]],
      pod: ["", [Validators.required]],
      detalle: [""],
      cantidadBultos: ["", [Validators.required]],
      tipoBultos: ["", [Validators.required]],
      vinculacionOtroRegistro: [""],
      whsReceipt: [""],
      documentoregistro: [""],
      imagen1: [""],
      imagen2: [""],
      imagen3: [""],
      imagen4: [""],
      imagen5: [""],
      estado: ["", [Validators.required]],
    });
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _fb: FormBuilder,
    private _clientSelectService: UsuarioSelectService,
    private _podSelectService: PodService,
    private _alert: AlertService,
    private _WhsService: WhsService,
    private _logsService: LogsService,
    public _dialogRef: MatDialogRef<WhsManageComponent>
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.listSelectClients();
    this.listSelectPod();
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

  listSelectPod(): void {
    this._podSelectService
      .listSelectPod()
      .subscribe((resp) => (this.podSelect = resp));
  }

  selectedImageWhsReceipt(file: File) {
    this.form.get("whsReceipt").setValue(file);
  }

  selectedImageDocumentoRegistro(file: File) {
    this.form.get("documentoregistro").setValue(file);
  }

  selectedImage1(file: File) {
    this.form.get("imagen1").setValue(file);
  }

  selectedImage2(file: File) {
    this.form.get("imagen2").setValue(file);
  }

  selectedImage3(file: File) {
    this.form.get("imagen3").setValue(file);
  }

  selectedImage4(file: File) {
    this.form.get("imagen4").setValue(file);
  }

  selectedImage5(file: File) {
    this.form.get("imagen5").setValue(file);
  }

  clientById(id: number): void {
    this._WhsService.WhsById(id).subscribe((resp) => {
      this.form.reset({
        id: resp.id,
        idtra: resp.idtra,
        numeroWHS: resp.numeroWHS,
        cliente: resp.cliente,
        tipoRegistro: resp.tipoRegistro,
        po: resp.po,
        statusWHS: resp.statusWHS,
        pol: resp.pol,
        pod: resp.pod,
        detalle: resp.detalle,
        cantidadBultos: resp.cantidadBultos,
        tipoBultos: resp.tipoBultos,
        vinculacionOtroRegistro: resp.vinculacionOtroRegistro,
        whsReceipt: resp.whsReceipt,
        documentoregistro: resp.documentoregistro,
        imagen1: resp.imagen1,
        imagen2: resp.imagen2,
        imagen3: resp.imagen3,
        imagen4: resp.imagen4,
        imagen5: resp.imagen5,
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
    this._WhsService.WhsRegister(data).subscribe((resp) => {
      if (resp.isSuccess) {
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);

        const log: LogsRequest = {
          usuario: `${this.user.family_name}`,
          modulo: "WHS",
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
    this._WhsService.WhsEdit(id, data).subscribe((resp) => {
      if (resp.isSuccess) {
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);

        const log: LogsRequest = {
          usuario: `${this.user.family_name}`,
          modulo: "WHS",
          tipoMetodo: "Edición",
          parametros: JSON.stringify(data),
          estado: 1
        };
        this._logsService.LogRegister(log).subscribe();
      }
    });
  }
}
