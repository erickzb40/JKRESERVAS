import { ExcelService } from './../../core/service/excel.service';
import { StringToDateService } from './../../core/service/string-to-date.service';
import { ReservasService } from './../../core/service/reservas.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {
  restaurantes: any = [];
  reservas: any = [];
  restaurant_value: string = '';
  fecha1: String;
  fecha2: String;
  constructor(public api: ReservasService,public stringDateTime:StringToDateService,public excel:ExcelService) {
    var fecha = new Date();
    var fecha = this.addHoursToDate(fecha,-5);
    this.fecha1 = fecha.toJSON().slice(0, 10);
    this.fecha2 = fecha.toJSON().slice(0, 10);
    this.api.getReservasRango(this.fecha1,this.fecha2).subscribe(res => { this.reservas = res; Swal.close();});
    this.api.getRestaurantes().subscribe((res: any) => { this.restaurantes = res.restaurants; });
  }

  ngOnInit(): void {
  }
  addHoursToDate(objDate, intHours) {
    var numberOfMlSeconds = objDate.getTime();
    var addMlSeconds = (intHours * 60) * 60000;
    var newDateObj = new Date(numberOfMlSeconds + addMlSeconds);
    return newDateObj;
}
async buscarReservas(){
  Swal.showLoading();
  if(this.restaurant_value==''){
    return Swal.fire({icon:'warning',title:'Seleccione un restaurant'});
  }
  this.api.getReservasRango(this.fecha1,this.fecha2).subscribe(res => { this.reservas = res; Swal.close();});
}
exportarEcel(){
  return this.excel.exportAsExcelFile(this.reservas,'Reservas');
}
}
