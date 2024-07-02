import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrigenListComponent } from './components/origen-list/origen-list.component';

const routes: Routes = [
  {
    path: "",
    component: OrigenListComponent,
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
export class OrigenRoutingModule { }
