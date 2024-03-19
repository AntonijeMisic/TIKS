import { createSelector } from "@ngrx/store";
import { AppState } from "../../app.state";

export const selectUserFeature = (state: AppState) => state.userState;

export const selectCurrentUser = createSelector(
    selectUserFeature,
    (state)=>state.user
);

export const selectCurrentUserId = createSelector(
    selectUserFeature,
    (state)=>{
        if(state.user)
            return state.user.id
        else
            return null
    }
);