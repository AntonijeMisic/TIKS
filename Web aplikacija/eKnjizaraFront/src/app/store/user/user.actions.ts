import { createAction, props } from "@ngrx/store"
import { User } from "../../shared/Models/User"

export const loadUser = createAction(
    "Load current user",
    props<{
        id: string
    }>()
)
export const loadUserSuccess = createAction(
    "Load current user success",
    props<{
        user: User | null
    }>()
)
export const logoutUser = createAction(
    "Log out current user"
)