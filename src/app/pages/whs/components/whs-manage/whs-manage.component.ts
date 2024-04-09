import { Component, Inject, OnInit } from "@angular/core";
import { IconsService } from "@shared/services/icons.service";
import * as configs from "../../../../../static-data/configs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService } from "@shared/services/alert.service";
import { WhsService } from "../../services/whs.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { UsuarioSelectService } from "@shared/services/usuario-select.service";
import { SelectAutoComplete } from "@shared/models/select-autocomplete.interface";

@Component({
  selector: "vex-whs-manage",
  templateUrl: "./whs-manage.component.html",
  styleUrls: ["./whs-manage.component.scss"],
})
export class WhsManageComponent implements OnInit {
  icClose = IconsService.prototype.getIcon("icClose");
  configs = configs;
  pol = [];
  status = ["En WHS", "Preparando para Envio", "Salida"];
  tipoRegistro = ["Ingreso", "Salida"];
  clientSelect: SelectAutoComplete[];
  pod = [
    "Miami, USA",
    "Ciudad de Guatemala, Guatemala",
    "San Pedro Sula, Honduras",
    "Tegucigalpa, Honduras",
    "Managua, Nicaragua",
    "San Jose, Costa Rica",
    "San Salvador, El Salvador",
    "Colon Free Zone, Panama",
    "Ciudad de Panama, Panama",
    "Lima, Peru",
  ];

  form: FormGroup;

  initForm(): void {
    this.form = this._fb.group({
      id: [0, [Validators.required]],
      idtra: ["", [Validators.required]],
      numeroWHS: ["", [Validators.required]],
      cliente: ["", [Validators.required]],
      tipoRegistro: ["", [Validators.required]],
      po: ["", [Validators.required]],
      statusWhs: ["", [Validators.required]],
      pol: ["", [Validators.required]],
      pod: ["", [Validators.required]],
      detalle: [""],
      cantidadBultos: ["", [Validators.required]],
      tipoBultos: ["", [Validators.required]],
      vinculacionOtroRegistro: [""],
      whsReceipt: ["", [Validators.required]],
      documentoregistro: ["", [Validators.required]],
      imagen1: ["", [Validators.required]],
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
    private _alert: AlertService,
    private _WhsService: WhsService,
    public _dialogRef: MatDialogRef<WhsManageComponent>
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.listSelectClients();
    if (this.data.data != null) {
      this.clientById(this.data.data.id);
    }

    switch (this.data.parametro) {
      case "guatemala":
        this.pol = ["Ciudad Guatemala, Guatemala"];
        break;
      case "honduras":
        this.pol = ["San Pedro Sula, Honduras"];
        break;
      case "miami":
        this.pol = ["Miami, USA"];
        break;
      case "panama":
        this.pol = ["CFZ, Panama"];
        break;
      case "sanjose":
        this.pol = ["SJO, CRC"];
        break;
      case "ningbo":
        this.pol = ["Ningbo, China"];
        break;
      case "shanghai":
        this.pol = ["Shanghai, China"];
        break;
    }
  }

  listSelectClients(): void {
    this._clientSelectService
      .listSelectUsuarios()
      .subscribe((resp) => (this.clientSelect = resp));
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
        statusWhs: resp.statusWHS,
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

    if (id > 0) {
      this.clientEdit(id);
    } else {
      this.clientRegister();
    }
  }

  clientRegister(): void {
    this._WhsService.WhsRegister(this.form.value).subscribe((resp) => {
      if (resp.isSuccess) {
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);
      } else {
        this._alert.warn("Atención", resp.message);
      }
    });
  }

  clientEdit(id: number): void {
    this._WhsService.WhsEdit(id, this.form.value).subscribe((resp) => {
      if (resp.isSuccess) {
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);
      }
    });
  }
}
