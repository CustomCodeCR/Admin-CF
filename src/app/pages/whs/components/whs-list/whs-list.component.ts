import { filter } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { CustomTitleService } from "@shared/services/custom-title.service";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { stagger40ms } from "src/@vex/animations/stagger.animation";
import { WhsService } from "../../services/whs.service";
import { componentSettings } from "./whs-list-config";
import { DateRange, FiltersBox } from "@shared/models/search-options.interface";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { WhsManageComponent } from "../whs-manage/whs-manage.component";
import { WhsResponse } from "../../models/whs-response.interface";
import { RowClick } from "@shared/models/row-click.interface";
import Swal from "sweetalert2";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "vex-Whs-list",
  templateUrl: "./whs-list.component.html",
  styleUrls: ["./whs-list.component.scss"],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
})
export class WhsListComponent implements OnInit {
  component: any;
  parametro: any;
  pol: string;

  constructor(
    customTitle: CustomTitleService,
    public _whsService: WhsService,
    public _dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    customTitle.set("Whs");
  }

  ngOnInit(): void {
    this.component = componentSettings;
    this.route.params.subscribe((params) => {
      this.parametro = params["parametro"];
      switch (this.parametro) {
        case "guatemala":
          this.component.filters.whs = "Ciudad Guatemala, Guatemala";
          this.pol = "Ciudad Guatemala, Guatemala";
          this.formatGetInputs();
          break;
        case "honduras":
          this.component.filters.whs = "San Pedro Sula, Honduras";
          this.pol = "San Pedro Sula, Honduras";
          this.formatGetInputs();
          break;
        case "miami":
          this.component.filters.whs = "Miami, USA";
          this.pol = "Miami, USA";
          this.formatGetInputs();
          break;
        case "panama":
          this.component.filters.whs = "CFZ, Panama";
          this.pol = "CFZ, Panama";
          this.formatGetInputs();
          break;
        case "sanjose":
          this.component.filters.whs = "SJO, CRC";
          this.pol = "SJO, CRC";
          this.formatGetInputs();
          break;
        case "ningbo":
          this.component.filters.whs = "Ningbo, China";
          this.pol = "Ningbo, China";
          this.formatGetInputs();
          break;
        case "shanghai":
          this.component.filters.whs = "Shanghai, China";
          this.pol = "Shanghai, China";
          this.formatGetInputs();
          break;
      }
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

    if (this.component.filters.whs != "") {
      str += `&whs=${this.component.filters.whs}`;
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
      .open(WhsManageComponent, {
        data: {
          parametro: this.parametro,
        },
        disableClose: true,
        width: "400px",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.setGetInputsWhs(true);
        }
      });
  }

  rowClick(rowClick: RowClick<WhsResponse>) {
    let action = rowClick.action;
    let client = rowClick.row;

    switch (action) {
      case "edit":
        this.WhsEdit(client);
        break;
      case "remove":
        this.WhsRemove(client);
        break;
    }

    return false;
  }

  WhsEdit(WhsData: WhsResponse) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = WhsData;
    dialogConfig.data.parametro = this.parametro;

    this._dialog
      .open(WhsManageComponent, {
        data: dialogConfig,
        disableClose: true,
        width: "400px",
      })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.setGetInputsWhs(true);
        }
      });
  }

  WhsRemove(WhsData: WhsResponse) {
    Swal.fire({
      title: `¿Realmente deseas eliminar el Whs ${WhsData.idtra}?`,
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
        this._whsService
          .WhsRemove(WhsData.id)
          .subscribe(() => this.setGetInputsWhs(true));
      }
    });
  }

  setGetInputsWhs(refresh: boolean) {
    this.component.filters.refresh = refresh;
    this.formatGetInputs();
  }

  get getDownloadUrl() {
    return `Whs?whs=${this.pol}&Download=True`;
  }
}
