import { Component, Inject, OnInit } from "@angular/core";
import { IconsService } from "@shared/services/icons.service";
import * as configs from "../../../../../static-data/configs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService } from "@shared/services/alert.service";
import { ItinerarioService } from "../../services/itinerario.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { LogsService } from "@shared/services/logs.service";
import { LogsRequest } from "@shared/models/logs-request.interface";

@Component({
  selector: "vex-itinerario-manage",
  templateUrl: "./itinerario-manage.component.html",
  styleUrls: ["./itinerario-manage.component.scss"],
})
export class ItinerarioManageComponent implements OnInit {
  transporteOptions = ["Aereo", "Maritimo", "Terrestre"];
  modalidadOptions = ["LCL", "LTL", "FCL", "FTL", "Multimodal"];
  polOptions = [
    "Ningbo, China",
    "Shanghai, China",
    "Qingdao, China",
    "Xiamen, China",
    "Yantian, China",
    "Guangzhou, China",
    "Miami, USA",
    "SJO, CRC",
    "PVG, China",
    "NKG, China",
    "PEK, China",
    "CFZ, Panama",
    "Ciudad Hidalgo, MX",
    "Ciudad de Guatemala, Guatemala",
    "Managua, Nicaragua",
    "San Pedro Sula, Honduras",
    "San Salvador, El Salvador",
    "Puerto Moin, CRC",
    "Puerto Caldera, CRC"
  ];
  podOptions = [
    "CFZ, Panama",
    "SJO, CRC",
    "Ciudad Guatemala, Guatemala",
    "San Pedro Sula, Honduras",
    "San Salvador, El Salvador",
    "Managua, Nicaragua",
    "Newark (New Jersey), USA",
    "Los Angeles (California), USA",
    "Port Everglades (Florida), USA",
    "Savannah (Georgia), USA",
    "Wilmington (North Carolina), USA",
    "Houston (Texas), USA"
  ];
  icClose = IconsService.prototype.getIcon("icClose");
  configs = configs;
  user = JSON.parse(localStorage.getItem('users'));

  form: FormGroup;

  initForm(): void {
    this.form = this._fb.group({
      id: [0, [Validators.required]],
      pol: ["", [Validators.required]],
      pod: ["", [Validators.required]],
      closing: [this.getFormattedDate(), [Validators.required]],
      etd: [this.getFormattedDate(), [Validators.required]],
      eta: [this.getFormattedDate(), [Validators.required]],
      carrier: ["", [Validators.required]],
      vessel: ["", [Validators.required]],
      voyage: ["", [Validators.required]],
      origen: ["", [Validators.required]],
      destino: ["", [Validators.required]],
      transporte: ["", [Validators.required]],
      modalidad: ["", [Validators.required]],
      estado: ["", [Validators.required]],
    });
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _fb: FormBuilder,
    private _alert: AlertService,
    private _logsService: LogsService,
    private _itinerarioService: ItinerarioService,
    public _dialogRef: MatDialogRef<ItinerarioManageComponent>
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    if (this.data != null) {
      this.clientById(this.data.data.id);
    }
  }

  selectedImageOrigen(file: File) {
    this.form.get("origen").setValue(file);
  }

  selectedImageDestino(file: File) {
    this.form.get("destino").setValue(file);
  }

  clientById(id: number): void {
    this._itinerarioService.ItinerarioById(id).subscribe((resp) => {
      const etd = new Date(resp.etd);
      const eta = new Date(resp.etd);
      const closing = new Date(resp.etd);

      this.form.reset({
        id: resp.id,
        pol: resp.pol,
        pod: resp.pod,
        closing: closing.toISOString().slice(0, 10),
        etd: etd.toISOString().slice(0, 10),
        eta: eta.toISOString().slice(0, 10),
        carrier: resp.carrier,
        vessel: resp.vessel,
        voyage: resp.voyage,
        origen: resp.origen,
        destino: resp.destino,
        transporte: resp.transporte,
        modalidad: resp.modalidad,
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
    this._itinerarioService
      .ItinerarioRegister(data)
      .subscribe((resp) => {
        if (resp.isSuccess) {
          this._alert.success("Excelente", resp.message);
          this._dialogRef.close(true);

          const log: LogsRequest = {
            usuario: `${this.user.family_name}`,
            modulo: "Itinerario",
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
    this._itinerarioService
      .ItinerarioEdit(id, data)
      .subscribe((resp) => {
        if (resp.isSuccess) {
          this._alert.success("Excelente", resp.message);
          this._dialogRef.close(true);

          const log: LogsRequest = {
            usuario: `${this.user.family_name}`,
            modulo: "Itinerario",
            tipoMetodo: "Edición",
            parametros: JSON.stringify(data),
            estado: 1
          };
          this._logsService.LogRegister(log).subscribe();
        }
      });
  }

  getFormattedDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // +1 porque enero es 0
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
}
