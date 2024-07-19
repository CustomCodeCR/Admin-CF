import { Component, OnInit } from "@angular/core";
import { CustomTitleService } from "@shared/services/custom-title.service";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { stagger40ms } from "src/@vex/animations/stagger.animation";
import { EmpleoService } from "../../services/empleo.service";
import { componentSettings } from "./empleo-list-config";
import { DateRange, FiltersBox } from "@shared/models/search-options.interface";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { EmpleoManageComponent } from "../empleo-manage/empleo-manage.component";
import { EmpleoResponse } from "../../models/empleo-response.interface";
import { RowClick } from "@shared/models/row-click.interface";
import Swal from "sweetalert2";
import { LogsRequest } from "@shared/models/logs-request.interface";
import { LogsService } from "@shared/services/logs.service";
import { Subscription } from "rxjs";
import { UpdateListService } from "@shared/services/update-list.service";

@Component({
  selector: "vex-empleo-list",
  templateUrl: "./empleo-list.component.html",
  styleUrls: ["./empleo-list.component.scss"],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
})
export class EmpleoListComponent implements OnInit {
  component: any;
  user = JSON.parse(localStorage.getItem('users'));
  private refreshSubscription: Subscription;

  constructor(
    customTitle: CustomTitleService,
    private _logsService: LogsService,
    public _empleoService: EmpleoService,
    private _updateListService: UpdateListService,
    public _dialog: MatDialog
  ) {
    customTitle.set("Empleos");
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
      .open(EmpleoManageComponent, {
        disableClose: true,
        width: "400px",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.setGetInputsempleo(true);
        }
      });
  }

  rowClick(rowClick: RowClick<EmpleoResponse>) {
    let action = rowClick.action;
    let client = rowClick.row;

    switch (action) {
      case "edit":
        this.empleoEdit(client);
        break;
      case "remove":
        this.empleoRemove(client);
        break;
    }

    return false;
  }

  empleoEdit(empleoData: EmpleoResponse) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = empleoData;

    this._dialog
      .open(EmpleoManageComponent, {
        data: dialogConfig,
        disableClose: true,
        width: "400px",
      })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.setGetInputsempleo(true);
        }
      });
  }

  empleoRemove(empleoData: EmpleoResponse) {
    Swal.fire({
      title: `¿Realmente deseas eliminar el empleo ${empleoData.titulo}?`,
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
        this._empleoService.empleoRemove(empleoData.id).subscribe(
          () => {
            this.setGetInputsempleo(true);

            const log: LogsRequest = {
              usuario: `${this.user.family_name}`,
              modulo: "Empleo",
              tipoMetodo: "Eliminación",
              parametros: JSON.stringify(empleoData),
              estado: 1
            };
            this._logsService.LogRegister(log).subscribe();
          },
          (error) => {
            console.error("Error eliminando empleo:", error);

            const log: LogsRequest = {
              usuario: `${localStorage.getItem('family_name')}`,
              modulo: "Empleo",
              tipoMetodo: "Eliminación",
              parametros: JSON.stringify(empleoData),
              estado: 0
            };
            this._logsService.LogRegister(log).subscribe();
          }
        );
      }
    });
  }

  setGetInputsempleo(refresh: boolean) {
    this.component.filters.refresh = refresh;
    this.formatGetInputs();
  }

  get getDownloadUrl() {
    return `empleo?Download=True`;
  }

  get getUploadUrl() {
    return `Empleo/Import/`;
  }

  private subscribeToRefreshList() {
    this.refreshSubscription = this._updateListService.refreshList$.subscribe((refresh) => {
      if (refresh) {
        this.setGetInputsempleo(true);
        console.log("Lista actualizada");
      }
    });
  }
}
