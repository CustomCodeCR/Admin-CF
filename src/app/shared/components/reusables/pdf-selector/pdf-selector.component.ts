import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { IconsService } from "@shared/services/icons.service";
import { toBase64 } from "@shared/functions/helpers";

@Component({
  selector: "app-pdf-selector",
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: "./pdf-selector.component.html",
  styleUrls: ["./pdf-selector.component.scss"],
})
export class PdfSelectorComponent implements OnInit {
  fileBase64: string;

  @Input() urlCurrentFile: string;
  @Input() acceptFileType: string = ".pdf"; // Acepta solo archivos PDF por defecto

  @Output() selectedFile: EventEmitter<File> = new EventEmitter<File>();

  icUpload = IconsService.prototype.getIcon("icUpload");

  constructor() {}

  ngOnInit(): void {}

  selectedFileEvent(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      const inputElement: HTMLInputElement = event.target;
      if (inputElement.files && inputElement.files.length > 0) {
        const file: File = inputElement.files[0];
        if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
          toBase64(file).then((value: string) => (this.fileBase64 = value));
        } else {
          this.fileBase64 = null;
        }
        this.selectedFile.emit(file);
        this.urlCurrentFile = null;
      }
    }
  }
}
