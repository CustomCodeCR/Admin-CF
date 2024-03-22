import { HttpHeaders } from "@angular/common/http";

export const endpoint = {
  //AUTH MODULE
  LOGIN: "Auth/Login",
  LOGIN_GOOGLE: "Auth/LoginWithGoogle",

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
};

export const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};
