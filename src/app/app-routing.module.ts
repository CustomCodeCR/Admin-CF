import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule } from "@angular/router";
import { VexRoutes } from "src/@vex/interfaces/vex-route.interface";
import { CustomLayoutComponent } from "./custom-layout/custom-layout.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { AuthGuard } from "@shared/guards/auth.guard";

const childrenRoutes: VexRoutes = [
  {
    path: "usuarios",
    loadChildren: () =>
      import("./pages/usuario/usuario.module").then((m) => m.UsuarioModule),
    canActivate: [AuthGuard],
    data: { key: "1" },
  },
  {
    path: "itinerarios",
    loadChildren: () =>
      import("./pages/itinerario/itinerario.module").then(
        (m) => m.ItinerarioModule
      ),
      canActivate: [AuthGuard],
      data: { key: "2" },
  },
  {
    path: "empleos",
    loadChildren: () =>
      import("./pages/empleo/empleo.module").then((m) => m.EmpleoModule),
    canActivate: [AuthGuard],
    data: { key: "3" },
  },
  {
    path: "noticias",
    loadChildren: () =>
      import("./pages/noticia/noticia.module").then((m) => m.NoticiaModule),
    canActivate: [AuthGuard],
    data: { key: "4" },
  },
  {
    path: "whs/:parametro",
    loadChildren: () =>
      import("./pages/whs/whs.module").then((m) => m.WhsModule),
    canActivate: [AuthGuard],
    data: { key: "5" },
  },
  {
    path: "finance",
    loadChildren: () =>
      import("./pages/finance/finance.module").then((m) => m.FinanceModule),
    canActivate: [AuthGuard],
    data: { key: "6" },
  },
  {
    path: "exoneraciones",
    loadChildren: () =>
      import("./pages/exoneracion/exoneracion.module").then((m) => m.ExoneracionModule),
    canActivate: [AuthGuard],
    data: { key: "7" },
  },
  {
    path: "logs",
    loadChildren: () =>
      import("./pages/log/log.module").then((m) => m.LogModule),
    canActivate: [AuthGuard],
    data: { key: "8" },
  },
  {
    path: "pol",
    loadChildren: () =>
      import("./pages/pol/pol.module").then((m) => m.PolModule),
    canActivate: [AuthGuard],
    data: { key: "9" },
  },
  {
    path: "pod",
    loadChildren: () =>
      import("./pages/pod/pod.module").then((m) => m.PodModule),
    canActivate: [AuthGuard],
    data: { key: "9" },
  },
  {
    path: "origen",
    loadChildren: () =>
      import("./pages/origen/origen.module").then((m) => m.OrigenModule),
    canActivate: [AuthGuard],
    data: { key: "9" },
  },
  {
    path: "destino",
    loadChildren: () =>
      import("./pages/destino/destino.module").then((m) => m.DestinoModule),
    canActivate: [AuthGuard],
    data: { key: "9" },
  },
  {
    path: "**",
    component: NotFoundComponent,
  },
];

const routes: VexRoutes = [
  {
    path: "",
    redirectTo: "usuarios",
    pathMatch: "full",
  },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/auth/auth.module").then((m) => m.AuthModule),
    data: {
      containerEnabled: true
    },
  },
  {
    path: "",
    component: CustomLayoutComponent,
    children: childrenRoutes,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: "enabled",
      relativeLinkResolution: "corrected",
      anchorScrolling: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
