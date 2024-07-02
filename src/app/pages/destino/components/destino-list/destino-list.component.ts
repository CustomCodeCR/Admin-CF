import { Component, OnInit } from '@angular/core';
import { LogsRequest } from '@shared/models/logs-request.interface';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { DestinoResponse } from '../../models/destino-response.interface';
import Swal from 'sweetalert2';
import { DestinoManageComponent } from '../destino-manage/destino-manage.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RowClick } from '@shared/models/row-click.interface';
import { DateRange, FiltersBox } from '@shared/models/search-options.interface';
import { componentSettings } from './destino-list-config';
import { DestinoService } from '../../services/destino.service';
import { LogsService } from '@shared/services/logs.service';
import { CustomTitleService } from '@shared/services/custom-title.service';

@Component({
  selector: 'vex-Destino-list',
  templateUrl: './Destino-list.component.html',
  styleUrls: ['./Destino-list.component.scss'],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
})
export class DestinoListComponent implements OnInit {
  component: any;
  user = JSON.parse(localStorage.getItem('users'));

  constructor(
    customTitle: CustomTitleService,
    public _DestinoService: DestinoService,
    private _logsService: LogsService,
    public _dialog: MatDialog
  ) {customTitle.set("Destino"); }

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
      .open(DestinoManageComponent, {
        disableClose: true,
        width: "400px",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.setGetInputsDestino(true);
        }
      });
  }

  rowClick(rowClick: RowClick<DestinoResponse>) {
    let action = rowClick.action;
    let client = rowClick.row;

    switch (action) {
      case "edit":
        this.DestinoEdit(client);
        break;
      case "remove":
        this.DestinoRemove(client);
        break;
    }

    return false;
  }

  DestinoEdit(DestinoData: DestinoResponse) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = DestinoData;

    this._dialog
      .open(DestinoManageComponent, {
        data: dialogConfig,
        disableClose: true,
        width: "400px",
      })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.setGetInputsDestino(true);
        }
      });
  }

  DestinoRemove(DestinoData: DestinoResponse) {
    Swal.fire({
      title: `¿Realmente deseas eliminar el Destino ${DestinoData.id}?`,
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
        this._DestinoService.DestinoRemove(DestinoData.id).subscribe(
          () => {
            this.setGetInputsDestino(true);

            const log: LogsRequest = {
              usuario: `${this.user.family_name}`,
              modulo: "Destino",
              tipoMetodo: "Eliminación",
              parametros: JSON.stringify(DestinoData),
              estado: 1,
            };
            this._logsService.LogRegister(log).subscribe();
          },
          (error) => {
            console.error("Error eliminando Destino:", error);

            const log: LogsRequest = {
              usuario: `${this.user.family_name}`,
              modulo: "Destino",
              tipoMetodo: "Eliminación",
              parametros: JSON.stringify(DestinoData),
              estado: 0,
            };
            this._logsService.LogRegister(log).subscribe();
          }
        );
      }
    });
  }

  setGetInputsDestino(refresh: boolean) {
    this.component.filters.refresh = refresh;
    this.formatGetInputs();
  }

  get getDownloadUrl() {
    return `destino?Download=True`;
  }
}
