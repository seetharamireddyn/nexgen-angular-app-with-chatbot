import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Services } from './components/services/services';
import { CsvTraining } from './components/csv-training/csv-training';
import { About } from './components/about/about';
import { Reviews } from './components/reviews/reviews';
import { Contact } from './components/contact/contact';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Home },
  { path: 'home', component: Home },
  { path: 'events', component: Home },
  { path: 'about', component: About },
  { path: 'services', component: Services },
  { path: 'csv-training', component: CsvTraining },
  { path: 'reviews', component: Reviews },
  { path: 'contact', component: Contact },
  { path: '**', redirectTo: 'home' }
];
