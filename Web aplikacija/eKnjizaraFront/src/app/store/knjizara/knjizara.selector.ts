import { createSelector } from "@ngrx/store";
import { AppState } from "../../app.state";
import { Knjizara } from "../../shared/Models/Knjizara";

export const selectBookstoreFeature = createSelector(
    (state: AppState) => state.knjizaraState,
    (knjizare) => knjizare
);

export const selectBookstoreIds = createSelector(
    selectBookstoreFeature,
    (knjizare) => knjizare.ids
);

export const selectAllBookstores = createSelector(selectBookstoreFeature, (knjizare) =>
    knjizare.ids
        .map((id) => knjizare.entities[id])
        .filter((knjizara) => knjizara != null)
        .map((knjizara) => <Knjizara>knjizara)
);

export const selectBookstoreId = createSelector(
    selectBookstoreFeature,
    (knjizare) => knjizare.selectedKnjizaraId
);

export const selectBookstore = createSelector(
    selectBookstoreFeature,
    selectBookstoreId,
    (knjizare, knjizaraId) => knjizare.entities[knjizaraId] ??null
);