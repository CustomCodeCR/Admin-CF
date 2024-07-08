import { Component, OnInit } from "@angular/core";
import { CustomTitleService } from "@shared/services/custom-title.service";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { stagger40ms } from "src/@vex/animations/stagger.animation";
import { MultimediaService } from "../../services/multimedia.service";
import { componentSettings } from "./multimedia-list-config";
import { DateRange, FiltersBox } from "@shared/models/search-options.interface";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MultimediaManageComponent } from "../multimedia-manage/multimedia-manage.component";
import { MultimediaResponse } from "../../models/multimedia-response.interface";
import { RowClick } from "@shared/models/row-click.interface";
import Swal from "sweetalert2";
import { LogsRequest } from "@shared/models/logs-request.interface";
import { LogsService } from "@shared/services/logs.service";

@Component({
  selector: "vex-multimedia-list",
  templateUrl: "./multimedia-list.component.html",
  styleUrls: ["./multimedia-list.component.scss"],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
})
export class MultimediaListComponent implements OnInit {
  component: any;
  user = JSON.parse(localStorage.getItem('users'));

  constructor(
    customTitle: CustomTitleService,
    public _MultimediaService: MultimediaService,
    private _logsService: LogsService,
    public _dialog: MatDialog
  ) {
    customTitle.set("Multimedias");
  }

  ngOnInit(): void {
    this.component = componentSettings;
  }

  setMenu(value: number) {
    this.component.filters.stateFilter = value;
    this.formatGetInputs();
  }

  search(data: FiltersBox) {
    this.component.filters.numFilter = data.searchValue;
    this.component.filters.textFilter = data.searchData;
    this.formatGetInputs();
  }

  searchDateRange(date: DateRange) {
    this.component.filters.startDate = date.startDate;
    this.component.filters.endDate = date.endDate;
    this.formatGetInputs();
  }

  resetFilters() {
    this.component.filters = { ...this.component.resetFilters };
    this.formatGetInputs();
  }

  formatGetInputs() {
    let str = "";

    if (this.component.filters.textFilter != null) {
      str += `&numFilter=${this.component.filters.numFilter}&textFilter=${this.component.filters.textFilter}`;
    }

    if (this.component.filters.stateFilter != null) {
      str += `&stateFilter=${this.component.filters.stateFilter}`;
    }

    if (
      this.component.filters.startDate != "" &&
      this.component.filters.endDate != ""
    ) {
      str += `&startDate=${this.component.filters.startDate}`;
      str += `&endDate=${this.component.filters.endDate}`;
    }

    if (this.component.filters.refresh) {
      let random = Math.random();
      str += `&refresh=${random}`;
      this.component.filters.refresh = false;
    }

    this.component.getInputs = str;
  }

  openDialogRegister() {
    this._dialog
      .open(MultimediaManageComponent, {
        disableClose: true,
        width: "400px",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.setGetInputsMultimedia(true);
        }
      });
  }

  rowClick(rowClick: RowClick<MultimediaResponse>) {
    let action = rowClick.action;
    let client = rowClick.row;

    switch (action) {
      case "edit":
        this.MultimediaEdit(client);
        break;
      case "remove":
        this.MultimediaRemove(client);
        break;
    }

    return false;
  }

  MultimediaEdit(MultimediaData: MultimediaResponse) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = MultimediaData;

    this._dialog
      .open(MultimediaManageComponent, {
        data: dialogConfig,
        disableClose: true,
        width: "400px",
      })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.setGetInputsMultimedia(true);
        }
      });
  }

  MultimediaRemove(MultimediaData: MultimediaResponse) {
    Swal.fire({
      title: `¿Realmente deseas eliminar el Multimedia ${MultimediaData.id}?`,
      text: "Se borrará de forma permanente!",
      icon: "warning",
      showCancelButton: true,
      focusCancel: true,
      confirmButtonColor: "rgb(210, 155, 253)",
      cancelButtonColor: "rgb(79, 109, 253)",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      width: 430,
    }).then((result) => {
      if (result.isConfirmed) {
        this._MultimediaService.MultimediaRemove(MultimediaData.id).subscribe(
          () => {
            this.setGetInputsMultimedia(true);

            // Registrar en los logs
            const log: LogsRequest = {
              usuario: `${this.user.family_name}`,
              modulo: "Multimedia",
              tipoMetodo: "Eliminación",
              parametros: JSON.stringify(MultimediaData),
              estado: 1,
            };
            this._logsService.LogRegister(log).subscribe();
          },
          (error) => {
            console.error("Error eliminando Multimedia:", error);

            const log: LogsRequest = {
              usuario: `${this.user.family_name}`,
              modulo: "Multimedia",
              tipoMetodo: "Eliminación",
              parametros: JSON.stringify(MultimediaData),
              estado: 0,
            };
            this._logsService.LogRegister(log).subscribe();
          }
        );
      }
    });
  }

  setGetInputsMultimedia(refresh: boolean) {
    this.component.filters.refresh = refresh;
    this.formatGetInputs();
  }

  get getDownloadUrl() {
    return `multimedia?Download=True`;
  }
}
