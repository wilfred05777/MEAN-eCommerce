import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { RouterModule } from '@angular/router';
import { ErrorPageComponent } from './pages/error-page/error-page.component';

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent, ErrorPageComponent],
  imports: [BrowserModule, RouterModule.forRoot([], { initialNavigation: 'enabledBlocking' })],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
