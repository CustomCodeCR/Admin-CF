import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { Platform } from "@angular/cdk/platform";
import { DOCUMENT } from "@angular/common";
import { Component, Inject, LOCALE_ID, Renderer2 } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IconsService } from "@shared/services/icons.service";
import { Settings } from "luxon";
import { filter, map } from "rxjs/operators";
import { ConfigName } from "../@vex/interfaces/config-name.model";
import { ConfigService } from "../@vex/services/config.service";
import { NavigationService } from "../@vex/services/navigation.service";
import { Style, StyleService } from "../@vex/services/style.service";

@Component({
  selector: "vex-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "vex";

  constructor(
    private configService: ConfigService,
    private styleService: StyleService,
    private renderer: Renderer2,
    private platform: Platform,
    @Inject(DOCUMENT) private document: Document,
    @Inject(LOCALE_ID) private localeId: string,
    private route: ActivatedRoute,
    private navigationService: NavigationService
  ) {
    Settings.defaultLocale = this.localeId;

    if (this.platform.BLINK) {
      this.renderer.addClass(this.document.body, "is-blink");
    }

    this.configService.updateConfig({
      sidenav: {
        title: "Grupo Castro Fallas",
        imageUrl: "/assets/img/demo/logo.png",
        showCollapsePin: true,
      },
    });

    this.route.queryParamMap
      .pipe(
        map(
          (queryParamMap) =>
            queryParamMap.has("rtl") &&
            coerceBooleanProperty(queryParamMap.get("rtl"))
        )
      )
      .subscribe((isRtl) => {
        this.document.body.dir = isRtl ? "rtl" : "ltr";
        this.configService.updateConfig({
          rtl: isRtl,
        });
      });

    this.route.queryParamMap
      .pipe(filter((queryParamMap) => queryParamMap.has("layout")))
      .subscribe((queryParamMap) =>
        this.configService.setConfig(queryParamMap.get("layout") as ConfigName)
      );

    this.route.queryParamMap
      .pipe(filter((queryParamMap) => queryParamMap.has("style")))
      .subscribe((queryParamMap) =>
        this.styleService.setStyle(queryParamMap.get("style") as Style)
      );

    this.navigationService.items = [
      {
        type: "link",
        label: "Usuarios",
        route: "usuarios",
        icon: IconsService.prototype.getIcon("icProvider"),
      },
      {
        type: "link",
        label: "Itinerarios",
        route: "itinerarios",
        icon: IconsService.prototype.getIcon("icCalendar"),
      },
      {
        type: "dropdown",
        label: "Publicaciones",
        icon: IconsService.prototype.getIcon("icManage"),
        children: [
          {
            type: "link",
            label: "Empleos",
            route: "empleos",
          },
          {
            type: "link",
            label: "Noticias",
            route: "noticias",
          },
        ],
      },
      {
        type: "dropdown",
        label: "WHS",
        icon: IconsService.prototype.getIcon("icWarehouse"),
        children: [
          {
            type: "link",
            label: "Miami, USA",
            route: "whs/miami",
          },
          {
            type: "link",
            label: "CFZ, Panama",
            route: "whs/panama",
          },
          {
            type: "link",
            label: "SJO, CRC",
            route: "whs/sanjose",
          },
          {
            type: "link",
            label: "Ningbo, China",
            route: "whs/ningbo",
          },
          {
            type: "link",
            label: "Shanghai, China",
            route: "whs/shanghai",
          },
          {
            type: "link",
            label: "Ciudad Guatemala, Guatemala",
            route: "whs/guatemala",
          },
          {
            type: "link",
            label: "San Pedro Sula, Honduras",
            route: "whs/honduras",
          },
        ],
      },
      {
        type: "link",
        label: "Finance",
        route: "finance",
        icon: IconsService.prototype.getIcon("icFinance"),
      },
      {
        type: "link",
        label: "Exoneraciones",
        route: "exoneraciones",
        icon: IconsService.prototype.getIcon("icExoneracion"),
      },
    ];
  }
}
