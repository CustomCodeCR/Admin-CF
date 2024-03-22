import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NoticiaListComponent } from "./components/noticia-list/noticia-list.component";

const routes: Routes = [
  {
    path: "",
    component: NoticiaListComponent,
    data: {
      scrollDisabled: true,
      toolbarShadowEnabled: true,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoticiaRoutingModule {}
