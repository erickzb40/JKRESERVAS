import { TableComponent } from './../../dashboard/table/table.component';
import { NgForm } from '@angular/forms';
import { ReservasService } from './../../../core/service/reservas.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {

  constructor(public api: ReservasService,public tb:TableComponent) {
    this.api.getRestaurantes().subscribe((res: any) => { this.restaurantes = res.restaurants; });
    var time = new Date();
    var time2 = this.addHoursToDate(time, -5);
    this.fecha = time2.toISOString().substring(0, 16);
  }
  fecha: string;
  restaurantes: any = [];
  restaurant_value: string = '';
  turno: string = 'Comida';
  tipo: string = 'RESERVA';

  register(f: NgForm) {
    if (f.invalid) { return; }
    f.value.date = new Date(this.fecha).toISOString();
    f.value.time = new Date(this.fecha).toISOString();
    this.api.crearReserva(f.value).subscribe(res => {
      Swal.fire({ icon: 'success', title: 'Creado Con exito!' });
      this.tb.cargarReservas();
    }, error => {
      Swal.fire({
        icon: 'error',
        title: 'Hubo un error'
      })
    })
  }
  addHoursToDate(objDate, intHours) {
    var numberOfMlSeconds = objDate.getTime();
    var addMlSeconds = (intHours * 60) * 60000;
    var newDateObj = new Date(numberOfMlSeconds + addMlSeconds);
    return newDateObj;
  }
  salir(){
    this.tb.cerrarModal();
  }
}
