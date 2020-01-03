import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {NgCircleProgressModule} from 'ng-circle-progress';
import {LoginPageModule} from './login/login.module';
import {LoginPage} from './login/login.page';
import {RegisterPageModule} from './register/register.module';
import {IonicStorageModule} from '@ionic/storage';
import {AccountService} from './services/account.service';
import {Network} from '@ionic-native/network/ngx';
import {Camera} from '@ionic-native/Camera/ngx';
import {File} from '@ionic-native/File/ngx';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import {FilePath} from '@ionic-native/file-path/ngx';
import {Base64} from '@ionic-native/base64/ngx';
import {EmailComposer} from '@ionic-native/email-composer/ngx';
import {HttpClientModule} from '@angular/common/http';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { GoogleMaps } from '@ionic-native/google-maps';
import {AuthenticationService} from './services/authentication.service';
import {PreferenceService} from './services/preference.service';
import {HelperService} from './services/helper.service';
import {MediaCapture} from '@ionic-native/media-capture/ngx';
import {Media} from '@ionic-native/media/ngx';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';


@NgModule({
    declarations: [AppComponent],
    entryComponents: [LoginPage],
    imports: [BrowserModule, NgCircleProgressModule.forRoot({
        // set defaults here
        radius: 100,
        outerStrokeWidth: 16,
        innerStrokeWidth: 8,
        outerStrokeColor: '#78C000',
        innerStrokeColor: '#C7E596',
        animationDuration: 300,
    }), IonicModule.forRoot(), AppRoutingModule, LoginPageModule, RegisterPageModule, IonicStorageModule.forRoot(), HttpClientModule],
    providers: [
        StatusBar,
        SplashScreen,
        EmailComposer,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        AccountService,
        AuthenticationService,
        Camera,
        Network,
        HelperService,
        GoogleMaps,
        File,
        Media,
        MediaCapture,
        WebView,
        Dialogs,
        SocialSharing,
        PreferenceService,
        Geolocation,
        FilePath,
        Base64],
    bootstrap: [AppComponent]
})
export class AppModule {
}
