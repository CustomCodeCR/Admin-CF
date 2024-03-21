import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItinerarioListComponent } from './components/itinerario-list/itinerario-list.component';

const routes: Routes = [
  {
    path: "",
    component: ItinerarioListComponent,
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
export class ItinerarioRoutingModule { }
