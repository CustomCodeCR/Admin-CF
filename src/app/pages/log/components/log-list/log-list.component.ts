import { Component, OnInit } from "@angular/core";
import { CustomTitleService } from "@shared/services/custom-title.service";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { stagger40ms } from "src/@vex/animations/stagger.animation";
import { LogService } from "../../services/log.service";
import { componentSettings } from "./log-list-config";
import { DateRange, FiltersBox } from "@shared/models/search-options.interface";
import { MatDialog } from "@angular/material/dialog";
import { LogResponse } from "../../models/log-response.interface";
import { RowClick } from "@shared/models/row-click.interface";

@Component({
  selector: 'vex-log-list',
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.scss'],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
})
export class UsuarioListComponent implements OnInit {
  component: any;

  constructor(
    customTitle: CustomTitleService,
    public _usuarioService: LogService,
    public _dialog: MatDialog
  ) {
    customTitle.set("Logs");
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

  rowClick(rowClick: RowClick<LogResponse>) {
    let action = rowClick.action;
    let client = rowClick.row;

    /*switch (action) {
      case "edit":
        this.usuarioEdit(client);
        break;
      case "remove":
        this.usuarioRemove(client);
        break;
    }*/

    return false;
  }

  setGetInputsUsuario(refresh: boolean) {
    this.component.filters.refresh = refresh;
    this.formatGetInputs();
  }

  get getDownloadUrl() {
    return `logs?Download=True`;
  }
}

