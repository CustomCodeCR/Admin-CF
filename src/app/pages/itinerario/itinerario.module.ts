import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ItinerarioRoutingModule } from "./itinerario-routing.module";
import { ItinerarioListComponent } from "./components/itinerario-list/itinerario-list.component";
import { ItinerarioManageComponent } from "./components/itinerario-manage/itinerario-manage.component";
import { ImgSelectorComponent } from "@shared/components/reusables/img-selector/img-selector.component";
import { SharedModule } from "@shared/shared.module";
import { ListTableComponent } from "@shared/components/reusables/list-table/list-table.component";
import { SearchBoxMultipleComponent } from "@shared/components/reusables/search-box-multiple/search-box-multiple.component";
import { MenuComponent } from "@shared/components/reusables/menu/menu.component";
import { ExportExcelComponent } from "@shared/components/reusables/export-excel/export-excel.component";
import { FilterDateRangeYmdComponent } from "@shared/components/reusables/filter-date-range-ymd/filter-date-range-ymd.component";
import { ButtonResetFiltersComponent } from "@shared/components/reusables/button-reset-filters/button-reset-filters.component";
import { MatDatepickerModule } from "@angular/material/datepicker";

@NgModule({
  declarations: [ItinerarioListComponent, ItinerarioManageComponent],
  imports: [
    CommonModule,
    ItinerarioRoutingModule,
    SharedModule,
    ListTableComponent,
    SearchBoxMultipleComponent,
    MenuComponent,
    ExportExcelComponent,
    FilterDateRangeYmdComponent,
    ButtonResetFiltersComponent,
    ImgSelectorComponent,
    MatDatepickerModule,
  ],
})
export class ItinerarioModule {}
