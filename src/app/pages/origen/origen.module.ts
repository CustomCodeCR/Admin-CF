import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrigenRoutingModule } from './origen-routing.module';
import { OrigenListComponent } from './components/origen-list/origen-list.component';
import { OrigenManageComponent } from './components/origen-manage/origen-manage.component';
import { SharedModule } from '@shared/shared.module';
import { ListTableComponent } from '@shared/components/reusables/list-table/list-table.component';
import { SearchBoxMultipleComponent } from '@shared/components/reusables/search-box-multiple/search-box-multiple.component';
import { MenuComponent } from '@shared/components/reusables/menu/menu.component';
import { ExportExcelComponent } from '@shared/components/reusables/export-excel/export-excel.component';
import { FilterDateRangeYmdComponent } from '@shared/components/reusables/filter-date-range-ymd/filter-date-range-ymd.component';
import { ButtonResetFiltersComponent } from '@shared/components/reusables/button-reset-filters/button-reset-filters.component';
import { ImgSelectorComponent } from '@shared/components/reusables/img-selector/img-selector.component';
import { PdfSelectorComponent } from '@shared/components/reusables/pdf-selector/pdf-selector.component';
import { SelectAutocompleteComponent } from '@shared/components/reusables/select-autocomplete/select-autocomplete.component';


@NgModule({
  declarations: [
    OrigenListComponent,
    OrigenManageComponent
  ],
  imports: [
    CommonModule,
    OrigenRoutingModule,
    SharedModule,
    ListTableComponent,
    SearchBoxMultipleComponent,
    MenuComponent,
    ExportExcelComponent,
    FilterDateRangeYmdComponent,
    ButtonResetFiltersComponent,
    ImgSelectorComponent,
    PdfSelectorComponent,
    SelectAutocompleteComponent,
  ]
})
export class OrigenModule { }
