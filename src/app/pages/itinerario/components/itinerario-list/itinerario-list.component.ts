import { Component, OnInit } from "@angular/core";
import { CustomTitleService } from "@shared/services/custom-title.service";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { stagger40ms } from "src/@vex/animations/stagger.animation";
import { ItinerarioService } from "../../services/itinerario.service";
import { componentSettings } from "./itinerario-list-config";
import { DateRange, FiltersBox } from "@shared/models/search-options.interface";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ItinerarioManageComponent } from "../itinerario-manage/itinerario-manage.component";
import { ItinerarioResponse } from "../../models/itinerario-response.interface";
import { RowClick } from "@shared/models/row-click.interface";
import Swal from "sweetalert2";
import { LogsService } from "@shared/services/logs.service";
import { LogsRequest } from "@shared/models/logs-request.interface";

@Component({
  selector: "vex-itinerario-list",
  templateUrl: "./itinerario-list.component.html",
  styleUrls: ["./itinerario-list.component.scss"],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
})
export class ItinerarioListComponent implements OnInit {
  component: any;
  user = JSON.parse(localStorage.getItem('users'));

  constructor(
    customTitle: CustomTitleService,
    public _itinerarioService: ItinerarioService,
    private _logsService: LogsService,
    public _dialog: MatDialog
  ) {
    customTitle.set("Itinerarios");
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
      .open(ItinerarioManageComponent, {
        disableClose: true,
        width: "400px",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.setGetInputsitinerario(true);
        }
      });
  }

  rowClick(rowClick: RowClick<ItinerarioResponse>) {
    let action = rowClick.action;
    let client = rowClick.row;

    switch (action) {
      case "status":
        this.itinerarioState(client);
        break;
      case "edit":
        this.itinerarioEdit(client);
        break;
      case "remove":
        this.itinerarioRemove(client);
        break;
    }

    return false;
  }

  itinerarioEdit(itinerarioData: ItinerarioResponse) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = itinerarioData;

    this._dialog
      .open(ItinerarioManageComponent, {
        data: dialogConfig,
        disableClose: true,
        width: "400px",
      })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.setGetInputsitinerario(true);
        }
      });
  }

  itinerarioRemove(itinerarioData: ItinerarioResponse) {
    Swal.fire({
      title: `¿Realmente deseas eliminar el itinerario ${itinerarioData.id}?`,
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
        this._itinerarioService.ItinerarioRemove(itinerarioData.id).subscribe(
          () => {
            this.setGetInputsitinerario(true);

            const log: LogsRequest = {
              usuario: `${this.user.family_name}`,
              modulo: "Itinerario",
              tipoMetodo: "Eliminación",
              parametros: JSON.stringify(itinerarioData),
              estado: 1,
            };
            this._logsService.LogRegister(log).subscribe();
          },
          (error) => {
            console.error("Error eliminando itinerario:", error);

            const log: LogsRequest = {
              usuario: `${this.user.family_name}`,
              modulo: "Itinerario",
              tipoMetodo: "Eliminación",
              parametros: JSON.stringify(itinerarioData),
              estado: 0,
            };
            this._logsService.LogRegister(log).subscribe();
          }
        );
      }
    });
  }

  itinerarioState(itinerarioData: ItinerarioResponse) {
    Swal.fire({
      title: `¿Realmente deseas cambiar el estado del itinerario ${itinerarioData.id}?`,
      text: "Se realizara un cambio de estado!",
      icon: "info",
      showCancelButton: true,
      focusCancel: true,
      confirmButtonColor: "rgb(210, 155, 253)",
      cancelButtonColor: "rgb(79, 109, 253)",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
      width: 430,
    }).then((result) => {
      if (result.isConfirmed) {
        this._itinerarioService.ItinerarioStatus(itinerarioData.id).subscribe(
          () => {
            this.setGetInputsitinerario(true);

            const log: LogsRequest = {
              usuario: `${this.user.family_name}`,
              modulo: "Itinerario",
              tipoMetodo: "Edición",
              parametros: JSON.stringify(itinerarioData),
              estado: 1,
            };
            this._logsService.LogRegister(log).subscribe();
          },
          (error) => {
            console.error("Error eliminando itinerario:", error);

            const log: LogsRequest = {
              usuario: `${this.user.family_name}`,
              modulo: "Itinerario",
              tipoMetodo: "Edición",
              parametros: JSON.stringify(itinerarioData),
              estado: 0,
            };
            this._logsService.LogRegister(log).subscribe();
          }
        );
      }
    });
  }

  setGetInputsitinerario(refresh: boolean) {
    this.component.filters.refresh = refresh;
    this.formatGetInputs();
  }

  get getDownloadUrl() {
    return `itinerario?Download=True`;
  }
}
