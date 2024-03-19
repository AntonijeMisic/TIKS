import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { mergeMap, map, catchError, of } from "rxjs";
import { UserService } from "../../shared/Services/user.service";
import { loadUser, loadUserSuccess } from "./user.actions";

@Injectable()
export class UserEffects {
    constructor(private service: UserService, private actions$: Actions) { }

    loadUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadUser),
            mergeMap((action) => this.service.getUserById(action.id).pipe(
                map((user) => (loadUserSuccess({ user: user }))),
                catchError(() => of({ type: "load error" }))
            ))
        ))
}