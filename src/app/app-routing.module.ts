import { VincularComponent } from './pages/vincular/vincular.component';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { DashboardComponent } from './pages/dashboard/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
{path: 'login',  component: LoginComponent },
{path: 'dashboard',  component: DashboardComponent,canActivate:[AuthGuard] },
{path: 'reportes',  component: ReportesComponent,canActivate:[AuthGuard] },
{path: 'vincular',  component: VincularComponent,canActivate:[AuthGuard] },
{path: '',  component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
