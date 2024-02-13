import { Routes } from '@angular/router'
import { MoviedetailComponent } from './movie/moviedetail/moviedetail.component'
import { MovieComponent } from './movie/movie.component'
import { AppComponent } from './app.component'


export const appRoutes: Routes = [
    {path: 'Detail/:id', component: MoviedetailComponent },
    {path: 'home', component: MovieComponent },
    {path: 'home/:id', component: MovieComponent },
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: '**', redirectTo: 'home', pathMatch: 'full' }
    
]