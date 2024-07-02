import { Component, OnInit } from '@angular/core';
import { LogsRequest } from '@shared/models/logs-request.interface';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { OrigenResponse } from '../../models/origen-response.interface';
import Swal from 'sweetalert2';
import { OrigenManageComponent } from '../origen-manage/origen-manage.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RowClick } from '@shared/models/row-click.interface';
import { DateRange, FiltersBox } from '@shared/models/search-options.interface';
import { componentSettings } from './origen-list-config';
import { OrigenService } from '../../services/origen.service';
import { LogsService } from '@shared/services/logs.service';
import { CustomTitleService } from '@shared/services/custom-title.service';

@Component({
  selector: 'vex-origen-list',
  templateUrl: './origen-list.component.html',
  styleUrls: ['./origen-list.component.scss'],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
})
export class OrigenListComponent implements OnInit {
  component: any;
  user = JSON.parse(localStorage.getItem('users'));

  constructor(
    customTitle: CustomTitleService,
    public _origenService: OrigenService,
    private _logsService: LogsService,
    public _dialog: MatDialog
  ) {customTitle.set("Origen"); }

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
      .open(OrigenManageComponent, {
        disableClose: true,
        width: "400px",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.setGetInputsOrigen(true);
        }
      });
  }

  rowClick(rowClick: RowClick<OrigenResponse>) {
    let action = rowClick.action;
    let client = rowClick.row;

    switch (action) {
      case "edit":
        this.OrigenEdit(client);
        break;
      case "remove":
        this.OrigenRemove(client);
        break;
    }

    return false;
  }

  OrigenEdit(OrigenData: OrigenResponse) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = OrigenData;

    this._dialog
      .open(OrigenManageComponent, {
        data: dialogConfig,
        disableClose: true,
        width: "400px",
      })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.setGetInputsOrigen(true);
        }
      });
  }

  OrigenRemove(OrigenData: OrigenResponse) {
    Swal.fire({
      title: `¿Realmente deseas eliminar el Origen ${OrigenData.id}?`,
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
        this._origenService.OrigenRemove(OrigenData.id).subscribe(
          () => {
            this.setGetInputsOrigen(true);

            const log: LogsRequest = {
              usuario: `${this.user.family_name}`,
              modulo: "Origen",
              tipoMetodo: "Eliminación",
              parametros: JSON.stringify(OrigenData),
              estado: 1,
            };
            this._logsService.LogRegister(log).subscribe();
          },
          (error) => {
            console.error("Error eliminando Origen:", error);

            const log: LogsRequest = {
              usuario: `${this.user.family_name}`,
              modulo: "Origen",
              tipoMetodo: "Eliminación",
              parametros: JSON.stringify(OrigenData),
              estado: 0,
            };
            this._logsService.LogRegister(log).subscribe();
          }
        );
      }
    });
  }

  setGetInputsOrigen(refresh: boolean) {
    this.component.filters.refresh = refresh;
    this.formatGetInputs();
  }

  get getDownloadUrl() {
    return `origen?Download=True`;
  }
}
