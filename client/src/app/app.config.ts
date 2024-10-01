import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';

export const socketConfig: SocketIoConfig = {
  url: 'wss://s5394035.elf.ict.griffith.edu.au:8443/proxy/8888/socket.io',
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