import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanceListComponent } from './components/finance-list/finance-list.component';

const routes: Routes = [
  {
    path: "",
    component: FinanceListComponent,
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
export class FinanceRoutingModule { }
