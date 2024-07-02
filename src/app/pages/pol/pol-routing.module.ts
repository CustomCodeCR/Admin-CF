import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PolListComponent } from './components/pol-list/pol-list.component';

const routes: Routes = [
  {
    path: "",
    component: PolListComponent,
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
export class PolRoutingModule { }
