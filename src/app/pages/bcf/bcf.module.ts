import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BcfRoutingModule } from './bcf-routing.module';
import { SharedModule } from '@shared/shared.module';
import { ListTableComponent } from '@shared/components/reusables/list-table/list-table.component';
import { SearchBoxMultipleComponent } from '@shared/components/reusables/search-box-multiple/search-box-multiple.component';
import { MenuComponent } from '@shared/components/reusables/menu/menu.component';
import { ExportExcelComponent } from '@shared/components/reusables/export-excel/export-excel.component';
import { ImportExcelComponent } from '@shared/components/reusables/import-excel/import-excel.component';
import { FilterDateRangeYmdComponent } from '@shared/components/reusables/filter-date-range-ymd/filter-date-range-ymd.component';
import { ButtonResetFiltersComponent } from '@shared/components/reusables/button-reset-filters/button-reset-filters.component';
import { ImgSelectorComponent } from '@shared/components/reusables/img-selector/img-selector.component';
import { PdfSelectorComponent } from '@shared/components/reusables/pdf-selector/pdf-selector.component';
import { SelectAutocompleteComponent } from '@shared/components/reusables/select-autocomplete/select-autocomplete.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BcfListComponent } from './components/bcf-list/bcf-list.component';
import { BcfManageComponent } from './components/bcf-manage/bcf-manage.component';


@NgModule({
  declarations: [
    BcfListComponent,
    BcfManageComponent
  ],
  imports: [
    CommonModule,
    BcfRoutingModule,
    SharedModule,
    ListTableComponent,
    SearchBoxMultipleComponent,
    MenuComponent,
    ExportExcelComponent,
    ImportExcelComponent,
    FilterDateRangeYmdComponent,
    ButtonResetFiltersComponent,
    ImgSelectorComponent,
    PdfSelectorComponent,
    SelectAutocompleteComponent,
    MatDatepickerModule,
  ]
})
export class BcfModule { }
