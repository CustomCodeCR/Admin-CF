import { filter } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { CustomTitleService } from "@shared/services/custom-title.service";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { stagger40ms } from "src/@vex/animations/stagger.animation";
import { BcfService } from "../../services/bcf.service";
import { componentSettings } from "./bcf-list-config";
import { DateRange, FiltersBox } from "@shared/models/search-options.interface";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { BcfManageComponent } from "../bcf-manage/bcf-manage.component";
import { BcfResponse } from "../../models/bcf-response.interface";
import { RowClick } from "@shared/models/row-click.interface";
import Swal from "sweetalert2";
import { LogsService } from "@shared/services/logs.service";
import { LogsRequest } from "@shared/models/logs-request.interface";
import { Subscription } from "rxjs";
import { UpdateListService } from "@shared/services/update-list.service";

@Component({
  selector: "vex-Bcf-list",
  templateUrl: "./bcf-list.component.html",
  styleUrls: ["./bcf-list.component.scss"],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
})
export class BcfListComponent implements OnInit {
  component: any;
  user = JSON.parse(localStorage.getItem('users'));
  private refreshSubscription: Subscription;

  constructor(
    customTitle: CustomTitleService,
    private _logsService: LogsService,
    public _BcfService: BcfService,
    private _updateListService: UpdateListService,
    public _dialog: MatDialog
  ) {
    customTitle.set("Bcf");
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

    if (this.component.filters.Bcf != "") {
      str += `&Bcf=${this.component.filters.Bcf}`;
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
      .open(BcfManageComponent, {
        disableClose: true,
        width: "400px",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.setGetInputsBcf(true);
        }
      });
  }

  rowClick(rowClick: RowClick<BcfResponse>) {
    let action = rowClick.action;
    let client = rowClick.row;

    switch (action) {
      case "edit":
        this.BcfEdit(client);
        break;
    }

    return false;
  }

  BcfEdit(BcfData: BcfResponse) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = BcfData;

    this._dialog
      .open(BcfManageComponent, {
        data: dialogConfig,
        disableClose: true,
        width: "400px",
      })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.setGetInputsBcf(true);
        }
      });
  }

  setGetInputsBcf(refresh: boolean) {
    this.component.filters.refresh = refresh;
    this.formatGetInputs();
  }

  get getDownloadUrl() {
    return `Bcf?Download=True`;
  }

  get getUploadUrl() {
    return `Bcf/Import/`;
  }

  private subscribeToRefreshList() {
    this.refreshSubscription = this._updateListService.refreshList$.subscribe((refresh) => {
      if (refresh) {
        this.setGetInputsBcf(true);
        console.log("Lista actualizada");
      }
    });
  }
}
