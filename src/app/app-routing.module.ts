import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule } from "@angular/router";
import { VexRoutes } from "src/@vex/interfaces/vex-route.interface";
import { CustomLayoutComponent } from "./custom-layout/custom-layout.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { AuthGuard } from "@shared/guards/auth.guard";

const childrenRoutes: VexRoutes = [
  {
    path: "itinerarios",
    loadChildren: () =>
      import("./pages/itinerario/itinerario.module").then(
        (m) => m.ItinerarioModule
      ),
    data: {
      containerEnabled: true,
    },
  },
  {
    path: "usuarios",
    loadChildren: () =>
      import("./pages/usuario/usuario.module").then((m) => m.UsuarioModule),
  },
  {
    path: "empleos",
    loadChildren: () =>
      import("./pages/empleo/empleo.module").then((m) => m.EmpleoModule),
  },
  {
    path: "noticias",
    loadChildren: () =>
      import("./pages/noticia/noticia.module").then((m) => m.NoticiaModule),
  },
  {
    path: "whs/:parametro",
    loadChildren: () =>
      import("./pages/whs/whs.module").then((m) => m.WhsModule),
  },
  {
    path: "finance",
    loadChildren: () =>
      import("./pages/finance/finance.module").then((m) => m.FinanceModule),
  },
  {
    path: "exoneraciones",
    loadChildren: () =>
      import("./pages/exoneracion/exoneracion.module").then((m) => m.ExoneracionModule),
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
