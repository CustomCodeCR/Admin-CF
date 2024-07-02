import { Component, OnInit } from '@angular/core';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { PodService } from '../../services/pod.service';
import { CustomTitleService } from '@shared/services/custom-title.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LogsService } from '@shared/services/logs.service';
import { LogsRequest } from '@shared/models/logs-request.interface';
import Swal from 'sweetalert2';
import { PodResponse } from '../../models/pod-response.interface';
import { PodManageComponent } from '../pod-manage/pod-manage.component';
import { RowClick } from '@shared/models/row-click.interface';
import { DateRange, FiltersBox } from '@shared/models/search-options.interface';
import { componentSettings } from './pod-list-config';

@Component({
  selector: 'vex-pod-list',
  templateUrl: './pod-list.component.html',
  styleUrls: ['./pod-list.component.scss'],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
})
export class PodListComponent implements OnInit {
  component: any;
  user = JSON.parse(localStorage.getItem('users'));

  constructor(
    customTitle: CustomTitleService,
    public _podService: PodService,
    private _logsService: LogsService,
    public _dialog: MatDialog
  ) {customTitle.set("Pod"); }

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
      .open(PodManageComponent, {
        disableClose: true,
        width: "400px",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.setGetInputsPod(true);
        }
      });
  }

  rowClick(rowClick: RowClick<PodResponse>) {
    let action = rowClick.action;
    let client = rowClick.row;

    switch (action) {
      case "edit":
        this.podEdit(client);
        break;
      case "remove":
        this.podRemove(client);
        break;
    }

    return false;
  }

  podEdit(podData: PodResponse) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = podData;

    this._dialog
      .open(PodManageComponent, {
        data: dialogConfig,
        disableClose: true,
        width: "400px",
      })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.setGetInputsPod(true);
        }
      });
  }

  podRemove(podData: PodResponse) {
    Swal.fire({
      title: `¿Realmente deseas eliminar el POD ${podData.id}?`,
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
        this._podService.PodRemove(podData.id).subscribe(
          () => {
            this.setGetInputsPod(true);

            const log: LogsRequest = {
              usuario: `${this.user.family_name}`,
              modulo: "POD",
              tipoMetodo: "Eliminación",
              parametros: JSON.stringify(podData),
              estado: 1,
            };
            this._logsService.LogRegister(log).subscribe();
          },
          (error) => {
            console.error("Error eliminando POD:", error);

            const log: LogsRequest = {
              usuario: `${this.user.family_name}`,
              modulo: "POD",
              tipoMetodo: "Eliminación",
              parametros: JSON.stringify(podData),
              estado: 0,
            };
            this._logsService.LogRegister(log).subscribe();
          }
        );
      }
    });
  }

  setGetInputsPod(refresh: boolean) {
    this.component.filters.refresh = refresh;
    this.formatGetInputs();
  }

  get getDownloadUrl() {
    return `itinerario?Download=True`;
  }
}
