import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControlInventarioListComponent } from './components/control-inventario-list/control-inventario-list.component';

const routes: Routes = [
  {
    path: "",
    component: ControlInventarioListComponent,
    data: {
      scrollDisabled: true,
      toolbarShadowEnabled: true,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlInventarioRoutingModule { }
