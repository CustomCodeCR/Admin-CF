import { TableColumns } from "@shared/models/list-table.interface";
import { MenuItems } from "@shared/models/menu-items.interface";
import { SearchOptions } from "@shared/models/search-options.interface";
import { IconsService } from "@shared/services/icons.service";
import { GenericValidators } from "@shared/validators/generic-validators";
import { BcfResponse } from "../../models/bcf-response.interface";

const searchOptions: SearchOptions[] = [
  {
    label: "IDTRA",
    value: 1,
    placeholder: "Buscar por IDTRA",
    validation: [GenericValidators.defaultName],
    validation_desc: "Sólo se permite nombres válidos.",
    icon: "icMail",
  },
  {
    label: "Cliente",
    value: 2,
    placeholder: "Buscar por Cliente",
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

const tableColumns: TableColumns<BcfResponse>[] = [
  {
    label: "BCF",
    cssLabel: ["font-bold", "text-sm"],
    property: "bcf",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "text",
    sticky: false,
    sort: true,
    sortProperty: "bcf",
    visible: true,
    download: true,
  },
  {
    label: "IDTRA",
    cssLabel: ["font-bold", "text-sm"],
    property: "idtra",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "text",
    sticky: false,
    sort: true,
    sortProperty: "idtra",
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
    property: "estadoBcf",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "badge",
    sticky: false,
    sort: false,
    visible: true,
    download: true,
  },
];

const filters = {
  numFilter: 0,
  textFilter: "",
  stateFilter: null,
  startDate: "",
  endDate: "",
  Bcf: "",
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
  icClient: IconsService.prototype.getIcon("icBcf"),
  searchOptions,
  menuItems,
  tableColumns,
  initialSort: "Id",
  initialSortDir: "desc",
  filters,
  resetFilters,
  getInputs,
  filename: "listado-de-Bcf",
};
