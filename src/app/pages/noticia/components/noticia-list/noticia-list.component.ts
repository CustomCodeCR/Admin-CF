import { Component, OnInit } from "@angular/core";
import { CustomTitleService } from "@shared/services/custom-title.service";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { stagger40ms } from "src/@vex/animations/stagger.animation";
import { NoticiaService } from "../../services/noticia.service";
import { componentSettings } from "./noticia-list-config";
import { DateRange, FiltersBox } from "@shared/models/search-options.interface";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { NoticiaManageComponent } from "../noticia-manage/noticia-manage.component";
import { NoticiaResponse } from "../../models/noticia-response.interface";
import { RowClick } from "@shared/models/row-click.interface";
import Swal from "sweetalert2";
import { LogsService } from "@shared/services/logs.service";
import { LogsRequest } from "@shared/models/logs-request.interface";

@Component({
  selector: "vex-noticia-list",
  templateUrl: "./noticia-list.component.html",
  styleUrls: ["./noticia-list.component.scss"],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
})
export class NoticiaListComponent implements OnInit {
  component: any;
  user = JSON.parse(localStorage.getItem('users'));

  constructor(
    customTitle: CustomTitleService,
    public _noticiaService: NoticiaService,
    private _logsService: LogsService,
    public _dialog: MatDialog
  ) {
    customTitle.set("Noticias");
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
      .open(NoticiaManageComponent, {
        disableClose: true,
        width: "400px",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.setGetInputsnoticia(true);
        }
      });
  }

  rowClick(rowClick: RowClick<NoticiaResponse>) {
    let action = rowClick.action;
    let client = rowClick.row;

    switch (action) {
      case "edit":
        this.noticiaEdit(client);
        break;
      case "remove":
        this.noticiaRemove(client);
        break;
    }

    return false;
  }

  noticiaEdit(noticiaData: NoticiaResponse) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = noticiaData;

    this._dialog
      .open(NoticiaManageComponent, {
        data: dialogConfig,
        disableClose: true,
        width: "400px",
      })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.setGetInputsnoticia(true);
        }
      });
  }

  noticiaRemove(noticiaData: NoticiaResponse) {
    Swal.fire({
      title: `¿Realmente deseas eliminar la noticia ${noticiaData.titulo}?`,
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
        this._noticiaService.noticiaRemove(noticiaData.id).subscribe(
          () => {
            this.setGetInputsnoticia(true);

            const log: LogsRequest = {
              usuario: `${this.user.family_name}`,
              modulo: "Noticia",
              tipoMetodo: "Eliminación",
              parametros: JSON.stringify(noticiaData),
              estado: 1,
            };
            this._logsService.LogRegister(log).subscribe();
          },
          (error) => {
            console.error("Error eliminando noticia:", error);

            const log: LogsRequest = {
              usuario: `${this.user.family_name}`,
              modulo: "Noticia",
              tipoMetodo: "Eliminación",
              parametros: JSON.stringify(noticiaData),
              estado: 0,
            };
            this._logsService.LogRegister(log).subscribe();
          }
        );
      }
    });
  }

  setGetInputsnoticia(refresh: boolean) {
    this.component.filters.refresh = refresh;
    this.formatGetInputs();
  }

  get getDownloadUrl() {
    return `noticia?Download=True`;
  }
}
