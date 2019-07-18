import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { provideRoutes, Routes, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { PDF417BarcodeModule } from 'angular2-pdf417-barcode';
import * as html2canvas from 'html2canvas';
import {RecaptchaModule} from 'ng-recaptcha';
import {RecaptchaFormsModule} from 'ng-recaptcha/forms';
import { RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';

//COMPONENTS
import { AppComponent } from './app.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { TuristourComponent } from './components/turistour/turistour.component';
import { BoletaComponent } from './components/boleta/boleta.component';
import { TjovenComponent } from './components/tjoven/tjoven.component';

//SERVICES
import { ServiciosService } from '../../src/app/service/servicios.service';
import { RepositoryService } from '../../src/app/service/repository.service';



//import {RecaptchaModule} from 'angular5-recaptcha';

const routes: Routes = [
    {
      path: 'main',
      component: PrincipalComponent
    },
    {
      path: 'boleta',
      component: BoletaComponent
    },
    {
      path:'turistour',
      component: TuristourComponent
    },
    {
      path:'tjoven',
      component: TjovenComponent
    },
    { path: '',
    redirectTo: '/main',
    pathMatch: 'full'
    },
    { path: '**', component: PrincipalComponent }
    
];

@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    BoletaComponent,
    TuristourComponent,
    TjovenComponent
   
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    HttpModule,
    PDF417BarcodeModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule
  ],
  providers: [
    ServiciosService,
    RepositoryService,
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: '6Lc8QFsUAAAAAEaoGjSVmUUI8oQzYlk6WRkag6Am' } as RecaptchaSettings,
    }
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
