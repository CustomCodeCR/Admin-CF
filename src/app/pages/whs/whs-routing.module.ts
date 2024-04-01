import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { WhsListComponent } from "./components/whs-list/whs-list.component";

const routes: Routes = [
  {
    path: "",
    component: WhsListComponent,
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
export class WhsRoutingModule {}
