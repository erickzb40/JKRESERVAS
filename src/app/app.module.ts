import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderComponent } from './pages/header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './pages/dashboard/dashboard/dashboard.component';
import { RegistroComponent } from './pages/modal/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { TableComponent } from './pages/dashboard/table/table.component';
import { ExcelService } from './core/service/excel.service';
import { FiltrosPipe } from './core/pipes/filtros.pipe';
import { FormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule,MatDialogRef  } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import { OrdenarPipe } from './core/pipes/ordenar.pipe';
import {MatTabsModule} from '@angular/material/tabs';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { VincularComponent } from './pages/vincular/vincular.component';
import { FiltroDocPipe } from './core/pipes/filtro-doc.pipe';
import { FiltroReservaPipe } from './core/pipes/filtro-reserva.pipe';
import { MatChipsModule } from '@angular/material/chips';
import { FiltroReservaMainPipe } from './core/pipes/filtro-reserva-main.pipe';
import { FiltradoPipe } from './core/pipes/filtrado.pipe';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DashboardComponent,
    RegistroComponent,
    LoginComponent,
    TableComponent,
    FiltrosPipe,
    OrdenarPipe,
    ReportesComponent,
    VincularComponent,
    FiltroDocPipe,
    FiltroReservaPipe,
    FiltroReservaMainPipe,
    FiltradoPipe,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    NgxPaginationModule,
    HttpClientModule,
    MatDialogModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatTabsModule,
    MatChipsModule
  ],
  providers: [ExcelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
