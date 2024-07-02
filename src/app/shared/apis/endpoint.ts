import { HttpHeaders } from "@angular/common/http";

export const endpoint = {
  //AUTH MODULE
  LOGIN: "Auth/Login",
  LOGIN_GOOGLE: "Auth/LoginWithGoogle",

  // USUARIO MODULE
  LIST_USUARIO: "Usuario",
  LIST_SELECT_USUARIO: "Usuario/Select",
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
  ITINERARIO_STATE: "Itinerario/State/",

  // EMPLEO MODULE
  LIST_EMPLEO: "Empleo",
  EMPLEO_BY_ID: "Empleo/",
  EMPLEO_REGISTER: "Empleo/Register/",
  EMPLEO_EDIT: "Empleo/Edit/",
  EMPLEO_REMOVE: "Empleo/Remove/",

  // NOTICIA MODULE
  LIST_NOTICIA: "Noticia",
  NOTICIA_BY_ID: "Noticia/",
  NOTICIA_REGISTER: "Noticia/Register/",
  NOTICIA_EDIT: "Noticia/Edit/",
  NOTICIA_REMOVE: "Noticia/Remove/",

  // WHS MODULE
  LIST_WHS: "Whs",
  WHS_BY_ID: "Whs/",
  WHS_REGISTER: "Whs/Register/",
  WHS_EDIT: "Whs/Edit/",
  WHS_REMOVE: "Whs/Remove/",

  // FINANCE MODULE
  LIST_FINANCE: "Finance",
  FINANCE_BY_ID: "Finance/",
  FINANCE_REGISTER: "Finance/Register/",
  FINANCE_EDIT: "Finance/Edit/",
  FINANCE_REMOVE: "Finance/Remove/",

  // EXONERACION MODULE
  LIST_EXONERACION: "Exoneracion",
  EXONERACION_BY_ID: "Exoneracion/",
  EXONERACION_REGISTER: "Exoneracion/Register/",
  EXONERACION_EDIT: "Exoneracion/Edit/",
  EXONERACION_REMOVE: "Exoneracion/Remove/",

  //LOGS MODULE
  LIST_LOGS: "Logs",
  LOGS_REGISTER: "Logs/Register/",

  //POL MODULE
  LIST_POL: "Pol",
  LIST_SELECT_POL_WHS: "Pol/Whs",
  LIST_SELECT_POL: "Pol/Select",
  POL_BY_ID: "Pol/",
  POL_REGISTER: "Pol/Register/",
  POL_EDIT: "Pol/Edit/",
  POL_REMOVE: "Pol/Remove/",

  //POD MODULE
  LIST_POD: "Pod",
  LIST_SELECT_POD: "Pod/Select",
  POD_BY_ID: "Pod/",
  POD_REGISTER: "Pod/Register/",
  POD_EDIT: "Pod/Edit/",
  POD_REMOVE: "Pod/Remove/",

  //ORIGEN MODULE
  LIST_ORIGEN: "Origen",
  LIST_SELECT_ORIGEN: "Origen/Select",
  ORIGEN_BY_ID: "Origen/",
  ORIGEN_REGISTER: "Origen/Register/",
  ORIGEN_EDIT: "Origen/Edit/",
  ORIGEN_REMOVE: "Origen/Remove/",

  //DESTINO MODULE
  LIST_DESTINO: "Destino",
  LIST_SELECT_DESTINO: "Destino/Select",
  DESTINO_BY_ID: "Destino/",
  DESTINO_REGISTER: "Destino/Register/",
  DESTINO_EDIT: "Destino/Edit/",
  DESTINO_REMOVE: "Destino/Remove/",
};

export const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};
