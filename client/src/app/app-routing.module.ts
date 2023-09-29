import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthenticateComponent } from './components/authenticate/authenticate.component';
import { FollowingComponent } from './components/following/following.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SavedComponent } from './components/saved/saved.component';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';

const routes: Routes = [
  {path: '', component : HomeComponent},
  {path: 'authenticate', component : AuthenticateComponent},
  {path: 'following', component : FollowingComponent},
  {path: 'profile/:id', component : ProfileComponent},
  {path: 'saved', component : SavedComponent},
  {path: 'search/:text', component : SearchPageComponent},
  {path: 'video/:id', component : VideoPlayerComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
