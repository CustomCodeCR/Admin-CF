import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "src/app/pages/auth/services/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

      const user = this.authService.userToken

      if (user) {

        const userPermissions = this.authService.getUserPermissions();

        if (userPermissions) {
          // Verificar si la ruta tiene la propiedad data con la clave key
          const requiredKey = route.data && route.data.key;
    
          // Permitir el acceso si no hay una clave requerida o si el usuario tiene permiso para la clave requerida
          if (!requiredKey || userPermissions.includes(+requiredKey)) {
            return true;
          }
    
          // Redirigir a una página de acceso denegado o a donde desees
          this.router.navigate(["/access-denied"]);
          return false;
        }
        return true
      }

    this.router.navigate(["/login"]);
    return false;
  }
}
