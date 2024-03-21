import { HttpHeaders } from "@angular/common/http";

export const endpoint = {
  // CATEGORY MODULE
  LIST_CATEGORIES: "Category",
  LIST_SELECT_CATEGORIES: "Category/Select",
  CATEGORY_BY_ID: "Category/",
  CATEGORY_REGISTER: "Category/Register/",
  CATEGORY_EDIT: "Category/Edit/",
  CATEGORY_REMOVE: "Category/Remove/",

  // AUTH MODULE
  LOGIN: "Auth/Login",
  LOGIN_GOOGLE: "Auth/LoginWithGoogle",

  // PROVIDER MODULE
  LIST_PROVIDERS: "Provider",
  LIST_SELECT_PROVIDERS: "Provider/Select",
  PROVIDER_REGISTER: "Provider/Register/",
  PROVIDER_EDIT: "Provider/Edit/",
  PROVIDER_BY_ID: "Provider/",
  PROVIDER_REMOVE: "Provider/Remove/",

  // DOCUMENT TYPE MODULE
  LIST_DOCUMENT_TYPES: "DocumentType",

  // WAREHOUSE MODULE
  LIST_WAREHOUSES: "Warehouse",
  LIST_SELECT_WAREHOUSES: "Warehouse/Select",
  WAREHOUSE_BY_ID: "Warehouse/",
  WAREHOUSE_REGISTER: "Warehouse/Register/",
  WAREHOUSE_EDIT: "Warehouse/Edit/",
  WAREHOUSE_REMOVE: "Warehouse/Remove/",

  // PRODUCT MODULE
  LIST_PRODUCTS: "Product",
  PRODUCT_BY_ID: "Product/",
  PRODUCT_REGISTER: "Product/Register/",
  PRODUCT_EDIT: "Product/Edit/",
  PRODUCT_REMOVE: "Product/Remove/",
  PRODUCT_STOCK_WAREHOUSE: "Product/ProductStockByWarehouse/",

  // DOCUMENT TYPE MODULE
  LIST_VOUCHER_DOCUMENT_TYPES: "VoucherDocumentType",
  LIST_SELECT_CLIENTS: "",

  // USUARIO MODULE
  LIST_USUARIO: "Usuario",
  USUARIO_BY_ID: "Usuario/",
  USUARIO_REGISTER: "Usuario/Register/",
  USUARIO_EDIT: "Usuario/Edit/",
  USUARIO_REMOVE: "Usuario/Remove/",

  // ITINERARIO MODULE
  LIST_ITINERARIO: "Itinerario",
  ITINERARIO_BY_ID: "Itinerario/",
  ITINERARIO_REGISTER: "Itinerario/Register/",
  ITINERARIO_EDIT: "Itinerario/Edit/",
  ITINERARIO_REMOVE: "Itinerario/Remove/",

  // EMPLEO MODULE

  // NOTICIA MODULE
};

export const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};
