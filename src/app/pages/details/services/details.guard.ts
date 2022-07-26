import { Injectable } from '@angular/core';
import
{
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';

@Injectable()
export class DetailsGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if(route.queryParams['lat'] && route.queryParams['lon']) {
      return true;
    }

    console.warn('guard', 'blocked');
    return this.router.createUrlTree(['']);
  }
}
