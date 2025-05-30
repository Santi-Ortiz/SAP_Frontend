import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuscarPropiedadesComponent } from './buscar-propiedades/buscar-propiedades.component';
import { RentarPropiedadesComponent } from './rentar-propiedades/rentar-propiedades.component';

const routes: Routes = [
  {path: '', redirectTo: '/propiedades', pathMatch: 'full'},
  {path: 'propiedades', component: BuscarPropiedadesComponent},
  {path: 'renta/:id', component: RentarPropiedadesComponent}, 
  {path: '**', redirectTo: '/propiedades' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
