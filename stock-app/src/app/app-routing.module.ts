import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRegisterComponent } from './user-register/user-register.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ProfilebasepageComponent } from './profilebasepage/profilebasepage.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AdminpageComponent } from './adminpage/adminpage.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { MsgexpertComponent } from './msgexpert/msgexpert.component';
import { SettingsComponent } from './settings/settings.component';
import { ExpertpageComponent } from './expertpage/expertpage.component';
import { ExpertOutComponent } from './expert-out/expert-out.component';
import { TickerDashboardComponent } from './ticker-dashboard/ticker-dashboard.component';
import { FtsepageComponent } from './ftsepage/ftsepage.component';
import { ExperthomeComponent } from './experthome/experthome.component';
import { HelpComponent } from './help/help.component';

const routes: Routes = [
  { path: 'register', component: UserRegisterComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'help', component: HelpComponent },
  { path: 'admin', component: UserLoginComponent },
  { path: 'home', component: HomepageComponent },
  { path: '*', component: HomepageComponent },
 
  {
    path: 'profile', component: ProfilebasepageComponent,
    children: [
      {
        path: 'user-home', component: UserProfileComponent
      },
      {
        path: 'admin-home', component: AdminpageComponent
      },
      {
        path: 'expert-list', component: ExpertpageComponent
      },
      {
        path: 'notif', component: NotificationsComponent
      },
      {
        path: 'msgexp', component: MsgexpertComponent
      },
      {
        path: 'settings', component: SettingsComponent
      },
      {
        path: 'exp-out', component: ExpertOutComponent
      },
      {
        path: 'exp-home', component: ExperthomeComponent
      },

    ]
  },
  { path: 'ticker', component: TickerDashboardComponent },
  { path: 'ticker/:id', component: TickerDashboardComponent},
  { path: 'ftse100', component: FtsepageComponent },
  // { path: 'profile',
  //  loadChildren: () => import('./profile-operation/profile-operation.module')
  // .then(m => m.ProfileOperationModule) }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}
