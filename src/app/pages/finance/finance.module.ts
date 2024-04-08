import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinanceRoutingModule } from './finance-routing.module';
import { FinanceListComponent } from './components/finance-list/finance-list.component';
import { FinanceManageComponent } from './components/finance-manage/finance-manage.component';


@NgModule({
  declarations: [
    FinanceListComponent,
    FinanceManageComponent
  ],
  imports: [
    CommonModule,
    FinanceRoutingModule
  ]
})
export class FinanceModule { }
