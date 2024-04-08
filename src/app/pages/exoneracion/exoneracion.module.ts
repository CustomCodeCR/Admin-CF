import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExoneracionRoutingModule } from './exoneracion-routing.module';
import { ExoneracionListComponent } from './components/exoneracion-list/exoneracion-list.component';
import { ExoneracionManageComponent } from './components/exoneracion-manage/exoneracion-manage.component';


@NgModule({
  declarations: [
    ExoneracionListComponent,
    ExoneracionManageComponent
  ],
  imports: [
    CommonModule,
    ExoneracionRoutingModule
  ]
})
export class ExoneracionModule { }
