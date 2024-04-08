import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExoneracionListComponent } from './components/exoneracion-list/exoneracion-list.component';

const routes: Routes = [
  {
    path: "",
    component: ExoneracionListComponent,
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
export class ExoneracionRoutingModule { }
