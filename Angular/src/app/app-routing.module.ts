import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { SportsComponent } from './components/sports/sports.component';
import { ContactusComponent } from './components/contactus/contactus.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { ChatboxComponent } from './components/chatbox/chatbox.component';
import { WeatherComponent } from  './components/weather/weather.component'

const routes: Routes = [
  { path: "", component:HomeComponent },
  { path: "home", component:HomeComponent },
  { path: "aboutus", component:AboutusComponent },
  { path: "contactus", component:ContactusComponent },
  { path: "sports", component:SportsComponent },
  {path: "chatbox", component: ChatboxComponent},
  {path: "weather", component: WeatherComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
