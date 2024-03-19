import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { mergeMap, map, catchError, of, tap } from "rxjs";
import { KnjizaraService } from "../../feature/services/knjizara/knjizara.service";
import * as KnjizaraActions from './knjizara.actions';

@Injectable()
export class KnjizaraEffects {
  constructor(private actions$: Actions, private knjizaraService: KnjizaraService) { }
  loadBookstore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KnjizaraActions.loadBookstore),
      mergeMap(() =>
        this.knjizaraService.getKnjizare().pipe(
          map((knjizare) => {
            return KnjizaraActions.loadBookstoreSuccess({ knjizare: knjizare });
          }),
          catchError(() => of({ type: 'load error' }))
        )
      )
    )
  );
  addNewBookstore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KnjizaraActions.addNewBookstore),
      mergeMap((action) => this.knjizaraService.dodajKnjizaru(action.userId, action.knjizara).pipe(
        map((k) => (KnjizaraActions.addNewBookstoreSuccess({ knjizara: k }))),
        catchError(() => of({ type: "load error" }))
      ))
    ))
  editBookstore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KnjizaraActions.editBookstore),
      mergeMap((action) => this.knjizaraService.izmeniKnjizaru(action.userId, action.knjizara).pipe(
        map((t) => (KnjizaraActions.editBookstoreSuccess({ knjizara: t }))),
        catchError(() => of({ type: "load error" }))
      ))
    ))
    deleteBookstore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KnjizaraActions.deleteBookstore),
      mergeMap((action) => this.knjizaraService.izbrisiKnjizaru(action.knjizaraid, action.userId).pipe(
        map((t) => (KnjizaraActions.deleteBookstoreSuccess({ knjizara: t }))),
        catchError(() => of({ type: "load error" }))
      ))
    ))
}