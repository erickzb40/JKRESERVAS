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
  fecha1: string;
  fecha2: string;
  token:string='';
  pd=0;
  pgDet=0;
  constructor(public api: ReservasService,public stringDateTime:StringToDateService,public excel:ExcelService) {
    var fecha = new Date();
    var fecha = this.addHoursToDate(fecha,-5);
    this.fecha1 = fecha.toJSON().slice(0, 10);
    this.fecha2 = fecha.toJSON().slice(0, 10);
    this.api.obtenerPermisoToken().subscribe((res:any)=>{
      this.token=res[0].token;
      this.api.getRestaurantes(this.token).subscribe((res: any) => {
        this.restaurantes = res.restaurants;
        if(res.restaurants[0].restaurant){
          this.restaurant_value= res.restaurants[0].restaurant;
          this.api.getReservasRango(this.fecha1, this.fecha2,this.restaurant_value).subscribe(res => { this.reservas = res; Swal.close(); });
        }
      });
    })
  }

  ngOnInit(): void {
  }
  addHoursToDate(objDate, intHours) {
    var numberOfMlSeconds = objDate.getTime();
    var addMlSeconds = (intHours * 60) * 60000;
    var newDateObj = new Date(numberOfMlSeconds + addMlSeconds);
    return newDateObj;
}
buscarReservas(){
  Swal.showLoading();
  if(this.restaurant_value==''){
    return Swal.fire({icon:'warning',title:'Seleccione un restaurant'});
  }
  this.api.getReservasRango(this.fecha1,this.fecha2,this.restaurant_value).subscribe(res => { this.pd=0;this.reservas = res; Swal.close();});
}
exportarEcel(){
  return this.excel.exportAsExcelFile(this.reservas,'Reservas');
}
}
