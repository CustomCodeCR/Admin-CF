import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AngularEditorConfig } from '@kolkov/angular-editor'; // Importar AngularEditorConfig
import { AlertService } from "@shared/services/alert.service";
import { NoticiaService } from "../../services/noticia.service";
import * as configs from "../../../../../static-data/configs";
import { IconsService } from '@shared/services/icons.service';

@Component({
  selector: "vex-noticia-manage",
  templateUrl: "./noticia-manage.component.html",
  styleUrls: ["./noticia-manage.component.scss"],
})
export class NoticiaManageComponent implements OnInit, OnDestroy {
  icClose = IconsService.prototype.getIcon("icClose");
  configs = configs;
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _fb: FormBuilder,
    private _alert: AlertService,
    private _noticiaService: NoticiaService,
    public _dialogRef: MatDialogRef<NoticiaManageComponent>
  ) {}

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',  
  };

  ngOnInit(): void {
    this.initForm();
    if (this.data != null) {
      this.clientById(this.data.data.id);
    }
  }

  ngOnDestroy() {}

  initForm(): void {
    this.form = this._fb.group({
      id: [0, [Validators.required]],
      titulo: ["", [Validators.required]],
      subtitulo: ["", [Validators.required]],
      contenido: [""],
      imagen: [""],
      estado: ["", [Validators.required]],
    });
  }

  selectedImage(file: File) {
    this.form.get("imagen").setValue(file);
  }

  clientById(id: number): void {
    this._noticiaService.noticiaById(id).subscribe((resp) => {
      this.form.reset({
        id: resp.id,
        titulo: resp.titulo,
        subtitulo: resp.subtitulo,
        contenido: resp.contenido,
        imagen: resp.imagen,
        estado: resp.estado,
      });
    });
  }

  clientSave(): void {
    if (this.form.invalid) {
      return Object.values(this.form.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    const id = this.form.get("id").value;

    if (id > 0) {
      this.clientEdit(id);
    } else {
      this.clientRegister();
    }
  }

  clientRegister(): void {
    this._noticiaService.noticiaRegister(this.form.value).subscribe((resp) => {
      if (resp.isSuccess) {
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);
      } else {
        this._alert.warn("Atención", resp.message);
      }
    });
  }

  clientEdit(id: number): void {
    this._noticiaService.noticiaEdit(id, this.form.value).subscribe((resp) => {
      if (resp.isSuccess) {
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);
      }
    });
  }
}
