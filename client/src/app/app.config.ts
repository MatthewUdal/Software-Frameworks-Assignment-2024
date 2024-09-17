import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';

const socketConfig: SocketIoConfig = {
  url: 'http://localhost:3000',
  options: {}
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    importProvidersFrom(
      HttpClientModule,
      SocketIoModule.forRoot(socketConfig)
    )
  ]
};
