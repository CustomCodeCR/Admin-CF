import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UpdateListService {
  private refreshListSource = new Subject<boolean>();

  refreshList$ = this.refreshListSource.asObservable();

  triggerRefresh(refresh: boolean) {
    this.refreshListSource.next(refresh);
  }
}