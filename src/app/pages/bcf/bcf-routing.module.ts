import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BcfListComponent } from './components/bcf-list/bcf-list.component';

const routes: Routes = [
  {
    path: "",
    component: BcfListComponent,
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
export class BcfRoutingModule { }
