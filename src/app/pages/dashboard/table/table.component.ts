import { StringToDateService } from './../../../core/service/string-to-date.service';
import { ExcelService } from '../../../core/service/excel.service';
import { ReservasService } from '../../../core/service/reservas.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import * as $ from 'jquery';
import { ThisReceiver } from '@angular/compiler';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  filtroReservas = '';
  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    width: '220px',
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  reservas: any = [];
  datePickerConfig: string;
  pages: number = 1;//paginacion
  restaurantes: any = [];
  restaurant_value: string = '';
  token:string='';
  FiltroReservaNombre = '';
  fecha1: String;
  fecha2: String;
  constructor(public api: ReservasService,
    public excel: ExcelService,
    public stringDateTime: StringToDateService,
    public dialog: MatDialog,
    private modalService: NgbModal) {
      Swal.showLoading();
      this.api.obtenerPermisoToken().subscribe((res:any)=>{
        this.token=res[0].token;
        this.api.getRestaurantes(this.token).subscribe((res: any) => {
          this.restaurantes = res.restaurants;
          if(res.restaurants[0].restaurant){
            this.restaurant_value= res.restaurants[0].restaurant;
            var objReservas = {
              date_end: this.fecha2,
              date_start: this.fecha1,
              group: "this",
              restaurant: this.restaurant_value,
              status: "all"
            }
            this.api.buscarReservas(objReservas,this.token).subscribe((res: any) => {
              if (res.reservs.length > 0) {
                var a = this.stringDateTime.StringToDate(res.reservs);
                this.api.insertarReservasPendientes(res.reservs, this.restaurant_value).subscribe(() => {
                  this.api.getReservasRango(this.fecha1, this.fecha2,this.restaurant_value).subscribe(res => { this.reservas = res; Swal.close(); });
                });
              } else {
                this.api.getReservasRango(this.fecha1, this.fecha2,this.restaurant_value).subscribe(res => { this.reservas = res; Swal.close(); });
                Swal.close();
              }
            }, error => {
              return Swal.fire({
                icon:'error',
                title:'Hubo un error en la conexión'
              })
            })
          }
        });
      })

  }

  ngOnInit(): void {
    var fecha = new Date();
    var fecha = this.addHoursToDate(fecha, -5);
    this.fecha1 = fecha.toJSON().slice(0, 10);
    this.fecha2 = fecha.toJSON().slice(0, 10);

  }
  addHoursToDate(objDate, intHours) {
    var numberOfMlSeconds = objDate.getTime();
    var addMlSeconds = (intHours * 60) * 60000;
    var newDateObj = new Date(numberOfMlSeconds + addMlSeconds);
    return newDateObj;
  }
  openModalRegistro(content) {
/*     this.dialog.open(RegistroComponent, {
      height: '600px',
      width: '850px',
    }); */
    this.modalService.open(content, { size: 'lg' });
  }
  cerrarModal(){
   this.modalService.dismissAll();
  }
  cargarReservas(){
    this.modalService.dismissAll();
    this.api.getReservasRango(this.fecha1, this.fecha2,this.restaurant_value).subscribe(res => { this.reservas = res; Swal.close(); });
  }
  buscarReservas() {

    Swal.showLoading();
    if (this.restaurant_value == '') {
      return Swal.fire({ icon: 'warning', title: 'Seleccione un restaurant' });
    }
    var objReservas = {
      date_end: this.fecha2,
      date_start: this.fecha1,
      group: "this",
      restaurant: this.restaurant_value,
      status: "all"
    }
    this.api.buscarReservas(objReservas,this.token).subscribe((res: any) => {
      this.pages=1;
      if (res.reservs.length > 0) {
        var a = this.stringDateTime.StringToDate(res.reservs);
        this.api.insertarReservasPendientes(res.reservs, this.restaurant_value).subscribe(() => {
          this.api.getReservasRango(this.fecha1, this.fecha2,this.restaurant_value).subscribe(res => { this.reservas = res; Swal.close(); });
        });
      } else {
        this.api.getReservasRango(this.fecha1, this.fecha2,this.restaurant_value).subscribe(res => { this.reservas = res; Swal.close(); });
        Swal.close();
      }
    }, error => {
      return Swal.fire({
        icon:'error',
        title:'Hubo un error en la conexión'
      })
    })
  }


  AnularEstado(id: string, campo: string, nombre: string, fecha: Date) {
    Swal.fire({
      icon: 'error',
      title: 'Está seguro cancelar la reserva para ' + nombre + ' el ' + new Date(fecha).toLocaleString() + '?',
      text: 'Está acción no se puede revertir',
      width: '350px',
      showCancelButton: true,
      cancelButtonColor: 'red',
      cancelButtonText: 'No',
      confirmButtonText: 'Si',
      confirmButtonColor: 'green',
      showConfirmButton: true,
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        var temp = { "id": id, "status": campo }
        this.enviarUpdateApi(temp);
      }
    })
  }

  SentarEstado(id: string, campo: string, nombre: string, mesa: string, pax: string) {
    nombre = nombre == null ? '' : nombre;
    pax = pax == null ? '' : pax;
    mesa = mesa == null ? '' : mesa;
    var html = '';
    var titulo = '';
    if (mesa == null || mesa == '' || pax == null || pax == '') {
      html = `<div style="display: grid;
     grid-template-columns: repeat(2, 1fr);
     grid-gap: 10px;">
     <label for="mesa" class="mt-2">Mesa :</label><input type="text" id="mesa" style="width:200px;margin-left:30px;margin-top:5px" class="form-control"  value="`+ mesa + `">
     <label for="pax" class="mt-2">Pax :</label><input type="text" id="pax" style="width:200px;margin-left:30px;margin-top:5px;margin-bot:5px" class="form-control" value="`+ pax + `">
   </div>`;
      if (pax == null || pax == '') {
        titulo = 'Está seguro de sentar a la reserva a nombre de ' + nombre + ' sin el pax?';
      } if (mesa == null || mesa == '') {
        titulo = 'Está seguro de sentar a la reserva a nombre de ' + nombre + ' sin una mesa?';
      }
    }
    else {
      titulo = 'Está seguro de sentar a la reserva a nombre de ' + nombre + ' en la mesa ' + mesa + '?';
    }
    Swal.fire({
      icon: 'success',
      title: titulo,
      text: 'Está acción no se puede revertir',
      width: '380px',
      showCancelButton: true,
      html: html,
      cancelButtonText: 'No',
      confirmButtonText: 'Si',
      cancelButtonColor: 'red',
      confirmButtonColor: 'green',
      showConfirmButton: true,
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        var temp;
        if (mesa == null || mesa == '' || pax == null || pax == '') {
          var pax_input = document.getElementById('pax') as HTMLInputElement | null;
          var mesa_input = document.getElementById('mesa') as HTMLInputElement | null;
          temp = {
            "id": id, "status": campo,
            "pax": pax_input.value,
            "mesa": mesa_input.value
          }
        }
        else {
          temp = {
            "id": id, "status": campo
          }
        }
        this.enviarUpdateApi(temp);
        this.api.getReservasRango(this.fecha1, this.fecha2,this.restaurant_value).subscribe(res => { this.reservas = res; Swal.close(); })
      }
    })
  }

  exportarEcel() {
    return this.excel.exportAsExcelFile(this.reservas, 'Reservas');
  }

  llenarFiltro(valor: any) {
    var r = document.getElementById(valor) as HTMLInputElement | null;
    this.filtroReservas = r.value;
  }
  AbrirDetalles($fcreada: string, $codigo: string, $proveniencia: string, $tipo: string, $telefono: string, $restaurant, $email: string) {
    /* var [fecha] = $fcreada.split('T'); */
    var codigo = '';
    if ($codigo != null || $codigo != '') {
      var codigo = `<a>Codigo: ` + $codigo + `</a><br>`;
    }
    Swal.fire({
      icon: 'info',
      width: '350px',
      html: `
      <a>Fecha creada: `+  $fcreada + `</a><br>
      `+ codigo + `
      <a>Proveniencia: `+ $proveniencia + `</a><br>
      <a>Telefono: `+ $telefono + `</a><br>
      <a>Tipo: `+ $tipo + `</a><br>
      <a>Restaurant: `+ $restaurant + `</a><br>
      <a>Email:`+ $email + `</a><br>`,
      focusConfirm: false,
    })
  }
  EditarCampos($id, $telefono, $nombre, $pax, $mesa) {
    $nombre = $nombre == null ? '' : $nombre;
    $telefono = $telefono == null ? '' : $telefono;
    $pax = $pax == null ? '' : $pax;
    $mesa = $mesa == null ? '' : $mesa;
    Swal.fire({
      title: 'Editar',
      width: '464px',
      showCancelButton: true,
      reverseButtons: true,
      cancelButtonColor: 'red',
      confirmButtonColor: 'green',
      cancelButtonText: 'Salir',
      html: `
      <div style="display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 10px;">
      <label for="nombre">Nombre :</label><input type="text" id="nombre" style="width:290px;margin-left:30px;margin-top:5px;margin-bot:5px" class="form-control" placeholder="Nombre" value="`+ $nombre + `">
      <label for="telefono">Telef :</label><input type="text" id="telefono" style="width:290px;margin-left:30px;margin-top:5px" class="form-control" placeholder="Telefono" value="`+ $telefono + `">
      <label for="pax">Pax :</label><input type="text" id="pax" style="width:290px;margin-left:30px;margin-top:5px;margin-bot:5px" class="form-control" placeholder="pax" value="`+ $pax + `">
      <label for="mesa">Mesa :</label><input type="text" id="mesa" style="width:290px;margin-left:30px;margin-top:5px" class="form-control" placeholder="mesa" value="`+ $mesa + `">
    </div>`,
      confirmButtonText: 'Grabar',
      focusConfirm: false,
    }).then(res => {
      if (res.isConfirmed) {
        var nombre = document.getElementById('nombre') as HTMLInputElement | null;
        var telefono = document.getElementById('telefono') as HTMLInputElement | null;
        var pax = document.getElementById('pax') as HTMLInputElement | null;
        var mesa = document.getElementById('mesa') as HTMLInputElement | null;
        const temp =
        {
          "id": $id,
          "user_name": nombre.value,
          "pax": pax.value,
          "mesa": mesa.value,
          "user_phone": telefono.value
        }
        this.enviarUpdateApi(temp);
      }
    })
  }

  enviarUpdateApi(temp) {
    this.api.updateReservas(temp).subscribe((res: any) => {
      if (Object.entries(res).length > 0) {
        this.api.getReservasRango(this.fecha1, this.fecha2,this.restaurant_value).subscribe(res => { this.reservas = res; Swal.close(); });
        return this.Toast.fire({
          icon: 'success',
          title: 'Actualizado'
        })
      }
    },
      error => {
        return this.Toast.fire({
          icon: 'error',
          title: 'Hubo un error'
        })
      });
  }
}
