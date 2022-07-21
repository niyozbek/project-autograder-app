import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {map, take} from "rxjs/operators";
import * as fromApp from '../store/app.reducer'
import {Store} from "@ngrx/store";
import * as AuthActions from './store/auth.actions'

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private store: Store<fromApp.AppState>) {
  }

  canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    this.store.dispatch(new AuthActions.AutoLogin())

    return this.store.select('auth').pipe(
      take(1),
      map(authState => {
        return authState.user
      }),
      map(user => {
        const isAuth = !!user
        if (isAuth) {
          return true
        }

        return this.router.createUrlTree(['/auth'])
      }))
  }
}
