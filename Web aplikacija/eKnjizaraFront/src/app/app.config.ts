import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { knjizaraReducer } from './store/knjizara/knjizara.reducer';
import { KnjizaraEffects } from './store/knjizara/knjizara.effects';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { UserEffects } from './store/user/user.effects';
import { userReducer } from './store/user/user.reducer';

export const appConfig: ApplicationConfig = {
  providers: [importProvidersFrom(HttpClientModule), provideRouter(routes), provideAnimationsAsync(), provideStore(), provideEffects(), provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  provideState({ name: 'knjizaraState', reducer: knjizaraReducer }),
  provideState({ name: 'userState', reducer: userReducer }), provideEffects([KnjizaraEffects, UserEffects])
  ]
};
