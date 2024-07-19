import { Component, OnInit } from "@angular/core";
import { CustomTitleService } from "@shared/services/custom-title.service";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { stagger40ms } from "src/@vex/animations/stagger.animation";
import { UsuarioService } from "../../services/usuario.service";
import { componentSettings } from "./usuario-list-config";
import { DateRange, FiltersBox } from "@shared/models/search-options.interface";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { UsuarioManageComponent } from "../usuario-manage/usuario-manage.component";
import { UsuarioResponse } from "../../models/usuario-response.interface";
import { RowClick } from "@shared/models/row-click.interface";
import Swal from "sweetalert2";
import { LogsRequest } from "@shared/models/logs-request.interface";
import { LogsService } from "@shared/services/logs.service";
import { Subscription } from "rxjs";
import { UpdateListService } from "@shared/services/update-list.service";

@Component({
  selector: "vex-usuario-list",
  templateUrl: "./usuario-list.component.html",
  styleUrls: ["./usuario-list.component.scss"],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
})
export class UsuarioListComponent implements OnInit {
  component: any;
  user = JSON.parse(localStorage.getItem('users'));
  private refreshSubscription: Subscription;

  constructor(
    customTitle: CustomTitleService,
    public _usuarioService: UsuarioService,
    private _logsService: LogsService,
    private _updateListService: UpdateListService,
    public _dialog: MatDialog
  ) {
    customTitle.set("Usuarios");
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
      .open(UsuarioManageComponent, {
        disableClose: true,
        width: "400px",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.setGetInputsUsuario(true);
        }
      });
  }

  rowClick(rowClick: RowClick<UsuarioResponse>) {
    let action = rowClick.action;
    let client = rowClick.row;

    switch (action) {
      case "edit":
        this.usuarioEdit(client);
        break;
      case "remove":
        this.usuarioRemove(client);
        break;
    }

    return false;
  }

  usuarioEdit(usuarioData: UsuarioResponse) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = usuarioData;

    this._dialog
      .open(UsuarioManageComponent, {
        data: dialogConfig,
        disableClose: true,
        width: "400px",
      })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.setGetInputsUsuario(true);
        }
      });
  }

  usuarioRemove(usuarioData: UsuarioResponse) {
    Swal.fire({
      title: `¿Realmente deseas eliminar el usuario ${usuarioData.correo}?`,
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
        this._usuarioService.UsuarioRemove(usuarioData.id).subscribe(
          () => {
            this.setGetInputsUsuario(true);

            // Registrar en los logs
            const log: LogsRequest = {
              usuario: `${this.user.family_name}`,
              modulo: "Usuario",
              tipoMetodo: "Eliminación",
              parametros: JSON.stringify(usuarioData),
              estado: 1,
            };
            this._logsService.LogRegister(log).subscribe();
          },
          (error) => {
            console.error("Error eliminando usuario:", error);

            const log: LogsRequest = {
              usuario: `${this.user.family_name}`,
              modulo: "Usuario",
              tipoMetodo: "Eliminación",
              parametros: JSON.stringify(usuarioData),
              estado: 0,
            };
            this._logsService.LogRegister(log).subscribe();
          }
        );
      }
    });
  }

  setGetInputsUsuario(refresh: boolean) {
    this.component.filters.refresh = refresh;
    this.formatGetInputs();
  }

  get getDownloadUrl() {
    return `usuario?Download=True`;
  }

  get getUploadUrl() {
    return `Usuario/Import/`;
  }

  private subscribeToRefreshList() {
    this.refreshSubscription = this._updateListService.refreshList$.subscribe((refresh) => {
      if (refresh) {
        this.setGetInputsUsuario(true);
        console.log("Lista actualizada");
      }
    });
  }
}
