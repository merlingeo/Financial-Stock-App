import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserRegisterComponent } from './user-register/user-register.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { TickerDashboardComponent } from './ticker-dashboard/ticker-dashboard.component';
import { HomepageComponent } from './homepage/homepage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// import { UserProfileComponent } from './profile-operation/user-profile/user-profile.component';
// import { AdminpageComponent } from './profile-operation/adminpage/adminpage.component';
// import { ExpertpageComponent } from './profile-operation/expertpage/expertpage.component';
// import { DialogboxComponent } from './dialogbox/dialogbox.component';
// import { NotificationsComponent } from './profile-operation/notifications/notifications.component';
// import { UserpageComponent } from './userpage/userpage.component';
import { ProfilebasepageComponent } from './profilebasepage/profilebasepage.component';
import { SharedModule } from './shared.module';
import { AdminpageComponent } from './adminpage/adminpage.component';
import { ExpertpageComponent } from './expertpage/expertpage.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MsgexpertComponent } from './msgexpert/msgexpert.component';
import { SettingsComponent } from './settings/settings.component';
import { ExpertOutComponent } from './expert-out/expert-out.component';
import { StarRatingComponent } from './star-rating/star-rating.component';

import { FtsepageComponent } from './ftsepage/ftsepage.component';
import { PlotlyViaWindowModule } from 'angular-plotly.js';
import { PlotlyComponent } from './plotly/plotly.component';
import { ExperthomeComponent } from './experthome/experthome.component';
import { HelpComponent } from './help/help.component';
// import * as PlotlyJS from 'plotly.js-dist-min';
// import { PlotlyModule } from 'angular-plotly.js';
// import { PlotlyViaWindowModule } from 'angular-plotly.js';
// PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    UserRegisterComponent,
    UserLoginComponent,
    UserProfileComponent,
    TickerDashboardComponent,
    HomepageComponent,
    AdminpageComponent,
    ExpertpageComponent,
    ProfilebasepageComponent,
    // DialogboxComponent,
    NotificationsComponent,
    MsgexpertComponent,
    SettingsComponent,
    ExpertOutComponent,
    StarRatingComponent,
    FtsepageComponent,
    PlotlyComponent,
    ExperthomeComponent,
    HelpComponent
  ],
  imports: [

    PlotlyViaWindowModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    SharedModule,
    
    
  ],
  exports:[
    // DialogboxComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
