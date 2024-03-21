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
      import("./pages/itinerario/itinerario.module").then((m) => m.ItinerarioModule),
    data: {
      containerEnabled: true,
    },
  },
  {
    path: "proveedores",
    loadChildren: () =>
      import("./pages/provider/provider.module").then((m) => m.ProviderModule),
  },
  {
    path: "usuarios",
    loadChildren: () =>
      import("./pages/usuario/usuario.module").then((m) => m.UsuarioModule),
  },
  {
    path: "almacenes",
    loadChildren: () =>
      import("./pages/warehouse/warehouse.module").then(
        (m) => m.WarehouseModule
      ),
  },
  {
    path: "productos",
    loadChildren: () =>
      import("./pages/product/product.module").then((m) => m.ProductModule),
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
      containerEnabled: true,
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
