import { Component, Input, OnInit, ViewChild, ElementRef } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";
import { UploadXslxService } from "@shared/services/upload-xslx.service";
import { IconsService } from "@shared/services/icons.service";
import { CommonModule } from "@angular/common";
import { IconsModule } from "@shared/import-modules/icons.module";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { UpdateListService } from "@shared/services/update-list.service";

@Component({
  selector: "app-import-excel",
  standalone: true,
  imports: [CommonModule, IconsModule, MatButtonModule, MatTooltipModule],
  templateUrl: "./import-excel.component.html",
  styleUrls: ["./import-excel.component.scss"],
})
export class ImportExcelComponent implements OnInit {
  icCloudUpload = IconsService.prototype.getIcon("icCloudUpload");

  @Input() url: string = "";

  infoTooltip = "Importar datos en formato Excel.";

  constructor(
    private _uploadXslxService: UploadXslxService,
    private _updateListService: UpdateListService,
    private _spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {}

  upload(event: any) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    Swal.fire({
      title: "Confirmar",
      text: "Esta acción importará los datos desde el archivo Excel seleccionado.",
      icon: "warning",
      showCancelButton: true,
      focusCancel: true,
      confirmButtonColor: "rgb(210, 155, 253)",
      cancelButtonColor: "rgb(79, 109, 253)",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      width: 430,
    }).then((result) => {
      if (result.isConfirmed) {
        this.executeUpload(file);
      }
    });
  }

  executeUpload(file: File) {
    this._spinner.show();
    console.log(file.name)
    console.log(this.url)
    this._uploadXslxService.executeUpload(file, this.url).subscribe(
      (response) => {
        this._spinner.hide();
        Swal.fire("Éxito", "Archivo Excel importado correctamente.", "success").then(() => {
          this._updateListService.triggerRefresh(true);
        });
      },
      (error) => {
        this._spinner.hide();
        Swal.fire("Error", "Hubo un problema al importar el archivo Excel.", "error");
        console.error("Error al cargar el archivo Excel:", error);
      }
    );
  }
}
