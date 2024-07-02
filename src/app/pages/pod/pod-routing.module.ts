import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PodListComponent } from './components/pod-list/pod-list.component';

const routes: Routes = [
  {
    path: "",
    component: PodListComponent,
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
export class PodRoutingModule { }
