import {HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { exhaustMap, map, take } from "rxjs/operators";
import { AuthService } from "./auth.service";
import * as fromApp from '../store/app.reducer'

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
  constructor(private authService: AuthService, private store: Store<fromApp.AppState>){}

  intercept(req: HttpRequest<any>, next: HttpHandler){
    return this.store.select('auth').pipe(
      take(1),
      map(authState => {
        return authState.user
      }),
      exhaustMap(user => {
        if(!user){
          return next.handle(req)
        }
        const modifiedReq = req.clone({
          headers: new HttpHeaders().set('Authorization', 'Bearer ' + user.token)
        })
        return next.handle(modifiedReq)
      })
    )
  }
}
