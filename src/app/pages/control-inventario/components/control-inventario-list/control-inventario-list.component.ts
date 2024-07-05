import { filter } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { CustomTitleService } from "@shared/services/custom-title.service";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { stagger40ms } from "src/@vex/animations/stagger.animation";
import { ControlInventarioService } from "../../services/control-inventario.service";
import { componentSettings } from "./control-inventario-list-config";
import { DateRange, FiltersBox } from "@shared/models/search-options.interface";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ControlInventarioManageComponent } from "../control-inventario-manage/control-inventario-manage.component";
import { ControlInventarioResponse } from "../../models/control-inventario-response.interface";
import { RowClick } from "@shared/models/row-click.interface";
import Swal from "sweetalert2";
import { ActivatedRoute } from "@angular/router";
import { LogsService } from "@shared/services/logs.service";
import { LogsRequest } from "@shared/models/logs-request.interface";

@Component({
  selector: "vex-control-inventario-list",
  templateUrl: "./control-inventario-list.component.html",
  styleUrls: ["./control-inventario-list.component.scss"],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
})
export class ControlInventarioListComponent implements OnInit {
  component: any;
  parametro: any;
  pol: string;
  user = JSON.parse(localStorage.getItem('users'));

  constructor(
    customTitle: CustomTitleService,
    public _ControlInventarioService: ControlInventarioService,
    public _dialog: MatDialog,
    private _logsService: LogsService,
    private route: ActivatedRoute
  ) {
    customTitle.set("ControlInventario");
  }

  ngOnInit(): void {
    this.component = componentSettings;
    this.route.params.subscribe((params) => {
      this.parametro = params["parametro"];
      this.component.filters.ControlInventario = params["parametro"].replace(/-/g, ' ');
      this.pol = params["parametro"].replace(/-/g, ' ');
      this.formatGetInputs();
    });
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

    if (this.component.filters.ControlInventario != "") {
      str += `&whs=${this.component.filters.ControlInventario}`;
    }

    if (this.component.filters.textFilter != "") {
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
      .open(ControlInventarioManageComponent, {
        data: {
          parametro: this.parametro,
        },
        disableClose: true,
        width: "400px",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.setGetInputsControlInventario(true);
        }
      });
  }

  rowClick(rowClick: RowClick<ControlInventarioResponse>) {
    let action = rowClick.action;
    let client = rowClick.row;

    switch (action) {
      case "edit":
        this.ControlInventarioEdit(client);
        break;
      case "remove":
        this.ControlInventarioRemove(client);
        break;
    }

    return false;
  }

  ControlInventarioEdit(ControlInventarioData: ControlInventarioResponse) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = ControlInventarioData;
    dialogConfig.data.parametro = this.parametro.replace(/-/g, ' ');

    this._dialog
      .open(ControlInventarioManageComponent, {
        data: dialogConfig,
        disableClose: true,
        width: "400px",
      })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.setGetInputsControlInventario(true);
        }
      });
  }

  ControlInventarioRemove(ControlInventarioData: ControlInventarioResponse) {
    Swal.fire({
      title: `¿Realmente deseas eliminar el Control Inventario ${ControlInventarioData.id}?`,
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
        this._ControlInventarioService.ControlInventarioRemove(ControlInventarioData.id).subscribe(
          () => {
            this.setGetInputsControlInventario(true);

            const log: LogsRequest = {
              usuario: `${this.user.family_name}`,
              modulo: "ControlInventario",
              tipoMetodo: "Eliminación",
              parametros: JSON.stringify(ControlInventarioData),
              estado: 1,
            };
            this._logsService.LogRegister(log).subscribe();
          },
          (error) => {
            console.error("Error eliminando ControlInventario:", error);

            const log: LogsRequest = {
              usuario: `${this.user.family_name}`,
              modulo: "ControlInventario",
              tipoMetodo: "Eliminación",
              parametros: JSON.stringify(ControlInventarioData),
              estado: 0,
            };
            this._logsService.LogRegister(log).subscribe();
          }
        );
      }
    });
  }

  setGetInputsControlInventario(refresh: boolean) {
    this.component.filters.refresh = refresh;
    this.formatGetInputs();
  }

  get getDownloadUrl() {
    return `ControlInventario?ControlInventario=${this.pol}&Download=True`;
  }
}
