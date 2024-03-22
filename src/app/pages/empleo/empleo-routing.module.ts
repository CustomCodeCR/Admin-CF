import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EmpleoListComponent } from "./components/empleo-list/empleo-list.component";

const routes: Routes = [
  {
    path: "",
    component: EmpleoListComponent,
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
export class EmpleoRoutingModule {}
