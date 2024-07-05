import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
  fileBase64: SafeResourceUrl | string;
  @Input() urlCurrentFile: string;
  @Input() acceptFileType: string = ".pdf, .xlsx"; // Acepta archivos PDF y XLSM

  @Output() selectedFile: EventEmitter<File> = new EventEmitter<File>();

  icUpload = IconsService.prototype.getIcon("icUpload");

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {}

  selectedFileEvent(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      const inputElement: HTMLInputElement = event.target;
      if (inputElement.files && inputElement.files.length > 0) {
        const file: File = inputElement.files[0];
        const fileType = file.type;
        if (fileType === "application/pdf" || file.name.endsWith(".pdf")) {
          toBase64(file).then((value: string) => {
            this.fileBase64 = this.sanitizer.bypassSecurityTrustResourceUrl(value);
          });
        } else if (fileType === "application/vnd.ms-excel.sheet.macroEnabled.12" || file.name.endsWith(".xlsm")) {
          const url = URL.createObjectURL(file);
          this.fileBase64 = this.sanitizer.bypassSecurityTrustResourceUrl('https://view.officeapps.live.com/op/embed.aspx?src=' + encodeURIComponent(url));
        } else {
          this.fileBase64 = null;
        }
        this.selectedFile.emit(file);
        this.urlCurrentFile = null;
      }
    }
  }
}