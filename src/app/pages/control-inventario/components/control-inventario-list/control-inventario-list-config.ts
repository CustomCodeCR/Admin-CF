import { TableColumns } from "@shared/models/list-table.interface";
import { MenuItems } from "@shared/models/menu-items.interface";
import { SearchOptions } from "@shared/models/search-options.interface";
import { IconsService } from "@shared/services/icons.service";
import { GenericValidators } from "@shared/validators/generic-validators";
import { ControlInventarioResponse } from "../../models/control-inventario-response.interface";

const searchOptions: SearchOptions[] = [
  {
    label: "Cliente",
    value: 1,
    placeholder: "Buscar por Cliente",
    validation: [GenericValidators.defaultName],
    validation_desc: "Sólo se permite nombres válidos.",
    icon: "icMail",
  },
  {
    label: "POL",
    value: 2,
    placeholder: "Buscar por POL",
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

const tableColumns: TableColumns<ControlInventarioResponse>[] = [
  {
    label: "NOMBRE CLIENTE",
    cssLabel: ["font-bold", "text-sm"],
    property: "nombreCliente",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "text",
    sticky: false,
    sort: true,
    sortProperty: "nombreCliente",
    visible: true,
    download: true,
  },
  {
    label: "CLIENTE",
    cssLabel: ["font-bold", "text-sm"],
    property: "cliente",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "text",
    sticky: false,
    sort: true,
    sortProperty: "cliente",
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
    label: "POL",
    cssLabel: ["font-bold", "text-sm"],
    property: "pol",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "text",
    sticky: false,
    sort: true,
    sortProperty: "pol",
    visible: true,
    download: true,
  },
  {
    label: "CONTROL INVENTARIO",
    cssLabel: ["font-bold", "text-sm"],
    property: "controlInventario",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "hiperlink",
    sticky: false,
    sort: true,
    sortProperty: "controlInventario",
    visible: true,
    download: true,
  },
  {
    label: "ESTADO",
    cssLabel: ["font-bold", "text-sm"],
    property: "estadoControlInventario",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "badge",
    sticky: false,
    sort: false,
    visible: true,
    download: true,
  },
  {
    label: "",
    cssLabel: [],
    property: "icEdit",
    cssProperty: [],
    type: "icon",
    action: "edit",
    sticky: false,
    sort: false,
    visible: true,
    download: false,
  },
  {
    label: "",
    cssLabel: [],
    property: "icDelete",
    cssProperty: [],
    type: "icon",
    action: "remove",
    sticky: false,
    sort: false,
    visible: true,
    download: false,
  },
];

const filters = {
  numFilter: 0,
  textFilter: "",
  stateFilter: null,
  startDate: "",
  endDate: "",
  ControlInventario: "",
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
  filename: "listado-de-ControlInventario",
};
