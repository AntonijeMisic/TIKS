import { EntityState, createEntityAdapter } from "@ngrx/entity";
import { Knjizara } from "../../shared/Models/Knjizara";
import { createReducer, on } from "@ngrx/store";
import * as Actions from './knjizara.actions';
import { switchMap } from "rxjs";

export interface KnjizaraState extends EntityState<Knjizara> {
  selectedKnjizaraId: number;
}

const adapter = createEntityAdapter<Knjizara>();

export const initialState: KnjizaraState = adapter.getInitialState({
  selectedKnjizaraId: 0,
});

export const knjizaraReducer = createReducer(
  initialState,
  on(Actions.loadBookstoreSuccess, (state, { knjizare }) =>
    adapter.setAll(knjizare, state)),
  on(Actions.selectBookstore, (state, { knjizaraId }) => {
    return {
      ...state,
      selectedKnjizaraId: knjizaraId,
    };
  }),
  on(Actions.addNewBookstoreSuccess, (state, { knjizara }) =>
    adapter.addOne(knjizara, state)), //to bi trebalo da u nase postojece stanje doda novu knjizaru
  on(Actions.editBookstoreSuccess, (state, { knjizara }) =>
    adapter.updateOne({
      id: knjizara.id,
      changes: knjizara
    }, state)), //to bi trebalo da u nase postojece stanje izmeni vec postojecu  knjizaru
  on(Actions.deleteBookstoreSuccess, (state, { knjizara }) =>
    adapter.removeOne(knjizara.id, state)),
  on(Actions.addBookToStore, (state, { bookstoreId, book }) => {
    const existingStore = state.entities[bookstoreId]; // Corrected variable name (should be `bookstoreId`)
    if (existingStore) {
      const updatedBookList = [...existingStore.knjige, book];
      return adapter.updateOne(
        { id: bookstoreId, changes: { knjige: updatedBookList } },
        state
      );
    } else {
      throw new Error('Knjizara sa tim id ne postoji');
    }
  }),
  on(Actions.updateBookInStore, (state, { bookId, bookstoreId, book }) => {
    const existingStore = state.entities[bookstoreId]; // Find the existing bookstore

    if (existingStore) {
      const updatedBooks = existingStore.knjige.map((existingBook) => { // Iterate through existing books
        return existingBook.id === bookId ? book : existingBook; // Replace book if ID matches
      });

      return adapter.updateOne(
        { id: bookstoreId, changes: { knjige: updatedBooks } },
        state
      );
    } else {
      console.error('Bookstore with ID:', bookstoreId, 'does not exist!');
      return state;
    }
  }),
  on(Actions.deleteBookFromStore, (state, { bookId, bookstoreId }) => {
    const existingStore = state.entities[bookstoreId]; // Find the bookstore

    if (existingStore) {
      const updatedBooks = existingStore.knjige.filter((existingBook) => existingBook.id !== Number(bookId)); // Filter book

      return adapter.updateOne(
        { id: bookstoreId, changes: { knjige: updatedBooks } },
        state
      );
    } else {
      console.error('Bookstore with ID:', bookstoreId, 'does not exist!');
      return state; // Return original state if bookstore not found
    }
  })
);