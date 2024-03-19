import { createReducer, on } from "@ngrx/store"
import { User } from "../../shared/Models/User"
import { loadUserSuccess, logoutUser } from "./user.actions"

export interface UserState{
    user: User | null,
}

export const initialState: UserState = {
    user: null,
}

export const userReducer = createReducer(
    initialState,
    on(loadUserSuccess, (state, {user})=>{
        return {...state, user: user}
    }),
    on(logoutUser, (state)=>{
        return {...state, user: null}
    })
)