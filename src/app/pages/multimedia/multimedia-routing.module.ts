import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MultimediaListComponent } from './components/multimedia-list/multimedia-list.component';

const routes: Routes = [
  {
    path: "",
    component: MultimediaListComponent,
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
export class MultimediaRoutingModule { }
