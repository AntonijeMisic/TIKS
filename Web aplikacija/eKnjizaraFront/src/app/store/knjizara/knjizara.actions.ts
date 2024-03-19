import { createAction, props } from "@ngrx/store";
import { Knjizara } from "../../shared/Models/Knjizara";
import { Knjiga } from "../../shared/Models/Knjiga";

export const loadBookstore = createAction('Load Bookstore');
export const loadBookstoreSuccess = createAction(
    'Load Bookstore Success',
    props<{ knjizare: Knjizara[] }>()
);

export const selectBookstore = createAction(
    "Select Bookstore",
    props<{
        knjizaraId: number
    }>()
)
export const addNewBookstore = createAction(
    "Dodaj novu knjizaru",
    props<{
        userId: string,
        knjizara: Knjizara
    }>()
)

export const addNewBookstoreSuccess = createAction(
    "Uspesno dodavanje knjizare",
    props<{
        knjizara: Knjizara
    }>()
)
export const editBookstore = createAction(
    "Izmeni knjizaru",
    props<{
        id: string,
        userId: string,
        knjizara: Knjizara
    }>()
)

export const editBookstoreSuccess = createAction(
    "Uspesno menjanje knjizare",
    props<{
        knjizara: Knjizara
    }>()
)
export const deleteBookstore = createAction(
    "Brisanje knjizare",
    props<{
        knjizaraid: string,
        userId: string
    }>()
)
export const deleteBookstoreSuccess = createAction(
    "Uspesno brisanje knjizare",
    props<{
        knjizara: Knjizara
    }>()
)
export const addBookToStore = createAction(
    "Dodaj Knjigu u Knjizaru",
    props<{ book: Knjiga, bookstoreId: number }>()
);
export const updateBookInStore = createAction(
    '[Knjizare] Izmeni Knjigu u Knjizari',
    props<{ bookId: number, bookstoreId: number, book: Knjiga }>() // Prosljeđuje se ID knjige, ID knjižare i ažurirani objekt knjige
);
export const deleteBookFromStore = createAction(
    '[Bookstore] Delete Book',
    props<{ bookId: string; bookstoreId: string }>()
);
