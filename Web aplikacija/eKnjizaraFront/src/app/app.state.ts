import { KnjizaraState } from "./store/knjizara/knjizara.reducer";
import { UserState } from "./store/user/user.reducer";

export interface AppState {
    knjizaraState: KnjizaraState;
    userState: UserState;
  }