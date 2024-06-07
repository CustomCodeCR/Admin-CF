import { TableColumns } from "@shared/models/list-table.interface";
import { MenuItems } from "@shared/models/menu-items.interface";
import { SearchOptions } from "@shared/models/search-options.interface";
import { IconsService } from "@shared/services/icons.service";
import { GenericValidators } from "@shared/validators/generic-validators";
import { LogResponse } from "../../models/log-response.interface";

const searchOptions: SearchOptions[] = [
  {
    label: "Usuario",
    value: 1,
    placeholder: "Buscar por Usuario",
    validation: [GenericValidators.defaultName],
    validation_desc: "Sólo se permite nombres válidos.",
    icon: "icMail",
  },
  {
    label: "Modulo",
    value: 2,
    placeholder: "Buscar por Modulo",
    validation: [GenericValidators.defaultName],
    validation_desc: "Sólo se permite nombres válidos.",
    icon: "icMail",
  },
  {
    label: "Accion",
    value: 3,
    placeholder: "Buscar por Accion",
    validation: [GenericValidators.defaultName],
    validation_desc: "Sólo se permite nombres válidos.",
    icon: "icMail",
  },
];

const menuItems: MenuItems[] = [
  {
    type: "link",
    id: "all",
    icon: IconsService.prototype.getIcon("icViewHeadline"),
    label: "Todos",
  },
  {
    type: "link",
    id: "Activo",
    value: 1,
    icon: IconsService.prototype.getIcon("icLabel"),
    label: "Activo",
    class: {
      icon: "text-green",
    },
  },
  {
    type: "link",
    id: "Inactivo",
    value: 0,
    icon: IconsService.prototype.getIcon("icLabel"),
    label: "Inactivo",
    class: {
      icon: "text-gray",
    },
  },
];

const tableColumns: TableColumns<LogResponse>[] = [
  {
    label: "USUARIO",
    cssLabel: ["font-bold", "text-sm"],
    property: "usuario",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "text",
    sticky: false,
    sort: true,
    sortProperty: "usuario",
    visible: true,
    download: true,
  },
  {
    label: "MODULO",
    cssLabel: ["font-bold", "text-sm"],
    property: "modulo",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "text",
    sticky: false,
    sort: true,
    sortProperty: "modulo",
    visible: true,
    download: true,
  },
  {
    label: "ACCION",
    cssLabel: ["font-bold", "text-sm"],
    property: "tipoMetodo",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "text",
    sticky: false,
    sort: true,
    sortProperty: "tipoMetodo",
    visible: true,
    download: true,
  },
  {
    label: "F. DE CREACIÓN",
    cssLabel: ["font-bold", "text-sm"],
    property: "fechaCreacionAuditoria",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "datetime",
    sticky: false,
    sort: true,
    visible: true,
    download: true,
  },
  {
    label: "ESTADO",
    cssLabel: ["font-bold", "text-sm"],
    property: "estadoLogs",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "badge",
    sticky: false,
    sort: false,
    visible: true,
    download: true,
  },
  {
    label: "PARAMETROS",
    cssLabel: ["font-bold", "text-sm"],
    property: "parametros",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "text",
    sticky: false,
    sort: true,
    sortProperty: "parametros",
    visible: true,
    download: true,
  }
];

const filters = {
  numFilter: 0,
  textFilter: "",
  stateFilter: null,
  startDate: "",
  endDate: "",
  whs: "",
  refresh: false,
};

const resetFilters = {
  numFilter: 0,
  textFilter: "",
  stateFilter: null,
  startDate: "",
  endDate: "",
  refresh: false,
};

const getInputs: string = "";

export const componentSettings = {
  icClient: IconsService.prototype.getIcon("icWarehouse"),
  searchOptions,
  menuItems,
  tableColumns,
  initialSort: "Id",
  initialSortDir: "desc",
  filters,
  resetFilters,
  getInputs,
  filename: "listado-de-Logs",
};
