import { Component, Inject, LOCALE_ID, OnDestroy, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@angular/cdk/platform';
import { Settings } from 'luxon';
import { ConfigService } from '../@vex/services/config.service';
import { Style, StyleService } from '../@vex/services/style.service';
import { NavigationService } from '../@vex/services/navigation.service';
import { NavigationItem, NavigationLink } from '../@vex/interfaces/navigation-item.interface';
import { IconsService } from '@shared/services/icons.service';
import { PolService } from '@shared/services/pol.service';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ConfigName } from 'src/@vex/interfaces/config-name.model';
import { PolResponse } from '@shared/models/pol-response.interface';
import { interval, Subject } from 'rxjs';

@Component({
  selector: 'vex-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  title = 'vex';
  private destroy$ = new Subject<void>();
  private updateInterval$ = interval(300000); // 5 minutes in milliseconds
  private localStorageKey = 'appSidebarData';

  constructor(
    private configService: ConfigService,
    private styleService: StyleService,
    private renderer: Renderer2,
    private platform: Platform,
    @Inject(DOCUMENT) private document: Document,
    @Inject(LOCALE_ID) private localeId: string,
    private route: ActivatedRoute,
    private navigationService: NavigationService,
    private polService: PolService
  ) {
    Settings.defaultLocale = this.localeId;

    if (this.platform.BLINK) {
      this.renderer.addClass(this.document.body, 'is-blink');
    }

    this.configService.updateConfig({
      sidenav: {
        title: 'Grupo Castro Fallas',
        imageUrl: '/assets/img/demo/logo.png',
        showCollapsePin: true,
      },
    });

    // Recuperar datos del localStorage al inicializar
    const storedSidebarData = localStorage.getItem(this.localStorageKey);
    if (storedSidebarData) {
      this.navigationService.items = JSON.parse(storedSidebarData);
    }

    this.route.queryParamMap
      .pipe(
        map(
          (queryParamMap) =>
            queryParamMap.has('rtl') &&
            coerceBooleanProperty(queryParamMap.get('rtl'))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((isRtl) => {
        this.document.body.dir = isRtl ? 'rtl' : 'ltr';
        this.configService.updateConfig({
          rtl: isRtl,
        });
      });

    this.route.queryParamMap
      .pipe(
        filter((queryParamMap) => queryParamMap.has('layout')),
        takeUntil(this.destroy$)
      )
      .subscribe((queryParamMap) =>
        this.configService.setConfig(queryParamMap.get('layout') as ConfigName)
      );

    this.route.queryParamMap
      .pipe(
        filter((queryParamMap) => queryParamMap.has('style')),
        takeUntil(this.destroy$)
      )
      .subscribe((queryParamMap) =>
        this.styleService.setStyle(queryParamMap.get('style') as Style)
      );

    this.updateSidebarData();
    // Configurar el intervalo para actualizar cada 5 minutos
    this.updateInterval$
      .pipe(
        switchMap(() => this.polService.listPol()),
        takeUntil(this.destroy$)
      )
      .subscribe((response: PolResponse[]) => {
        this.updateSidebarData(response);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateSidebarData(polResponse?: PolResponse[]) {
    this.polService.listPol().subscribe((response: PolResponse[]) => {
      const whsItems = response
        .filter((item) => item.whs === 1)
        .map((item) => ({
          type: 'link' as const,
          label: item.nombre,
          route: `whs/${item.nombre.replace(/ /g, '-')}`,
        }));

        const controlInventarioItems = response
        .filter((item) => item.whs === 1)
        .map((item) => ({
          type: 'link' as const,
          label: item.nombre,
          route: `control-inventario/${item.nombre.replace(/ /g, '-')}`,
        }));

      const updatedNavigationItems: NavigationItem[] = [
        {
          type: 'link',
          label: 'Usuarios',
          route: 'usuarios',
          icon: IconsService.prototype.getIcon('icProvider'),
        },
        {
          type: 'link',
          label: 'Itinerarios',
          route: 'itinerarios',
          icon: IconsService.prototype.getIcon('icCalendar'),
        },
        {
          type: 'dropdown',
          label: 'Publicaciones',
          icon: IconsService.prototype.getIcon('icManage'),
          children: [
            {
              type: 'link',
              label: 'Empleos',
              route: 'empleos',
            },
            {
              type: 'link',
              label: 'Noticias',
              route: 'noticias',
            },
          ],
        },
        {
          type: 'dropdown',
          label: 'WHS',
          icon: IconsService.prototype.getIcon('icWarehouse'),
          children: whsItems,
        },
        {
          type: 'dropdown',
          label: 'Control Inventario',
          icon: IconsService.prototype.getIcon('icWarehouse'),
          children: controlInventarioItems,
        },
        {
          type: 'link',
          label: 'Finance',
          route: 'finance',
          icon: IconsService.prototype.getIcon('icFinance'),
        },
        {
          type: 'link',
          label: 'Exoneraciones',
          route: 'exoneraciones',
          icon: IconsService.prototype.getIcon('icExoneracion'),
        },
        {
          type: 'dropdown',
          label: 'Datos',
          icon: IconsService.prototype.getIcon('icManage'),
          children: [
            {
              type: 'link',
              label: 'Paises',
              route: 'paises',
            },
            {
              type: 'link',
              label: 'Puertos',
              route: 'puertos',
            },
          ],
        },
        {
          type: 'link',
          label: 'Multimedia',
          route: 'multimedia',
          icon: IconsService.prototype.getIcon('icManage'),
        },
        {
          type: 'link',
          label: 'Logs',
          route: 'logs',
          icon: IconsService.prototype.getIcon('icExoneracion'),
        },
      ];

      // Actualizar datos del sidebar
      this.navigationService.items = updatedNavigationItems;

      // Guardar datos en localStorage
      localStorage.setItem(this.localStorageKey, JSON.stringify(updatedNavigationItems));
    });
  }
}
