import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EmpleoRoutingModule } from "./empleo-routing.module";
import { EmpleoListComponent } from "./components/empleo-list/empleo-list.component";
import { EmpleoManageComponent } from "./components/empleo-manage/empleo-manage.component";
import { SharedModule } from "@shared/shared.module";
import { ListTableComponent } from "@shared/components/reusables/list-table/list-table.component";
import { SearchBoxMultipleComponent } from "@shared/components/reusables/search-box-multiple/search-box-multiple.component";
import { MenuComponent } from "@shared/components/reusables/menu/menu.component";
import { ExportExcelComponent } from "@shared/components/reusables/export-excel/export-excel.component";
import { FilterDateRangeYmdComponent } from "@shared/components/reusables/filter-date-range-ymd/filter-date-range-ymd.component";
import { ButtonResetFiltersComponent } from "@shared/components/reusables/button-reset-filters/button-reset-filters.component";
import { ImgSelectorComponent } from "@shared/components/reusables/img-selector/img-selector.component";

@NgModule({
  declarations: [EmpleoListComponent, EmpleoManageComponent],
  imports: [
    CommonModule,
    EmpleoRoutingModule,
    SharedModule,
    ListTableComponent,
    SearchBoxMultipleComponent,
    MenuComponent,
    ExportExcelComponent,
    FilterDateRangeYmdComponent,
    ButtonResetFiltersComponent,
    ImgSelectorComponent,
  ],
})
export class EmpleoModule {}
