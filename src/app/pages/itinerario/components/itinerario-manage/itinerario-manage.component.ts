import { Component, Inject, OnInit } from "@angular/core";
import { IconsService } from "@shared/services/icons.service";
import * as configs from "../../../../../static-data/configs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService } from "@shared/services/alert.service";
import { ItinerarioService } from "../../services/itinerario.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "vex-itinerario-manage",
  templateUrl: "./itinerario-manage.component.html",
  styleUrls: ["./itinerario-manage.component.scss"],
})
export class ItinerarioManageComponent implements OnInit {
  icClose = IconsService.prototype.getIcon("icClose");
  configs = configs;

  form: FormGroup;

  initForm(): void {
    this.form = this._fb.group({
      id: [0, [Validators.required]],
      pol: ["", [Validators.required]],
      pod: ["", [Validators.required]],
      closing: [new Date(), [Validators.required]],
      etd: [new Date(), [Validators.required]],
      eta: [new Date(), [Validators.required]],
      carrier: ["", [Validators.required]],
      vessel: ["", [Validators.required]],
      voyage: [""],
      estado: ["", [Validators.required]],
    });
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _fb: FormBuilder,
    private _alert: AlertService,
    private _itinerarioService: ItinerarioService,
    public _dialogRef: MatDialogRef<ItinerarioManageComponent>,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    if (this.data != null) {
      this.clientById(this.data.data.id);
    }
  }

  clientById(id: number): void {
    this._itinerarioService.ItinerarioById(id).subscribe((resp) => {
      const etd = new Date(resp.etd)
      const eta = new Date(resp.etd)
      const closing = new Date(resp.etd)

      this.form.reset({
        id: resp.id,
        pol: resp.pol,
        pod: resp.pod,
        closing: closing,
        etd: etd,
        eta: eta,
        carrier: resp.carrier,
        vessel: resp.vessel,
        voyage: resp.voyage,
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
    this._itinerarioService
      .ItinerarioRegister(this.form.value)
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
    this._itinerarioService
      .ItinerarioEdit(id, this.form.value)
      .subscribe((resp) => {
        if (resp.isSuccess) {
          this._alert.success("Excelente", resp.message);
          this._dialogRef.close(true);
        }
      });
  }
}
