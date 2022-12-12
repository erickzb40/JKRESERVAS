import { ReservasService } from './../../core/service/reservas.service';
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-vincular',
  templateUrl: './vincular.component.html',
  styleUrls: ['./vincular.component.scss']
})
export class VincularComponent {
  pgv = 0;
  pc = 0;//paginacion doc cab
  fecha1: string;
  fecha2: string;
  FiltroDocumento = '';
  FiltroReservaNombre = '';
  reservas: any = [];
  restaurant_value: string = '';
  token: string = '';
  restaurantes: any = [];
  documentosCabecera: any = [];
  documentosDetalle: any = [];
  //datos para vincular
  reservaActual: string = '';
  idReservaActual: string = '';
  //-------------------
  //documentos en el rango de la reserva (vinculados)
  DocVinculados: any = [];

  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  constructor(public api: ReservasService, private modalService: NgbModal) {
    Swal.showLoading();
    this.api.obtenerPermisoToken().subscribe((res: any) => {
      this.token = res[0].token;
      this.api.getRestaurantes(this.token).subscribe((res: any) => {
        this.restaurantes = res.restaurants;
        if (res.restaurants[0].restaurant) {
          this.restaurant_value = res.restaurants[0].restaurant;
          this.obtenerReservasRango('cerrar');
        } else {
          Swal.close();
        }
      });
    },
      err => { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); })
    var fecha = new Date();
    var fecha = this.addHoursToDate(fecha, -5);
    this.fecha1 = fecha.toJSON().slice(0, 10);
    this.fecha2 = fecha.toJSON().slice(0, 10);
  }
  obtenerReservasRango(condicion: string) {
    return this.api.getReservasRangoSentado(this.fecha1, this.fecha2, this.restaurant_value).subscribe(res => {
      this.reservas = res;
      this.vincularAutomatico();
      if (condicion == 'cerrar') Swal.close();
    },
      err => {
        if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
        else { Swal.fire({ icon: 'warning', text: 'Hubo un error al crear el registro' }); }
      }
    );
  }
  vincularAutomatico() {
    this.buscarDocumentosXacto();
    setTimeout(() => {
      for (let index = 0; index < this.documentosCabecera.length; index++) {
        const doc = this.documentosCabecera[index];
        for (let index2 = 0; index2 < this.reservas.length; index2++) {
         if(!isNaN(doc.mesa)&&!isNaN(this.reservas[index2].mesa)&&doc.mesa==this.reservas[index2].mesa){
          if (this.reservas[index2].doc_vinculados.length==0&&this.convertTime(doc.fechaEmision, -5) > this.convertTime(this.reservas[index2].date, -5) && this.convertTime(this.reservas[index2].date, -5) < this.convertTime(this.reservas[index2].date, 1)) {
            const objeto=this.documentosCabecera[index];
            objeto.id_reserva=this.reservas[index2].id;
            objeto.user_name=this.reservas[index2].user_name;
            objeto.id_reserv=this.reservas[index2].id_reserv;

            this.DocVinculados.push(objeto);
            break;
          }
         }
        }
      }
    console.log(this.DocVinculados)
    }, 3000);
 /*    console.log(this.addHoursToDate(new Date(new Date('2022-12-06 15:35:36').toISOString()), -5).toISOString()) */

    /*     console.log('2022-12-06 15:35:36') */
  }
  //convierte en fecha actual
  convertTime(fecha: string, horas: number) {
    var Resp = this.addHoursToDate(new Date(fecha), horas).toISOString();
    return new Date(Resp);
    return
  }
  addHoursToDate(objDate, intHours) {
    var numberOfMlSeconds = objDate.getTime();
    var addMlSeconds = (intHours * 60) * 60000;
    var newDateObj = new Date(numberOfMlSeconds + addMlSeconds);
    return newDateObj;
  }
  buscarReservas() {
    Swal.showLoading();
    if (this.restaurant_value == '') {
      return Swal.fire({ icon: 'warning', title: 'Seleccione un restaurant' });
    }
    this.api.getReservasRangoSentado(this.fecha1, this.fecha2, this.restaurant_value).subscribe(res => { this.pgv = 0; this.reservas = res; Swal.close(); }
      , err => {
        if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
        else { Swal.fire({ icon: 'warning', text: 'Hubo un error al crear el registro' }); }
      }
    );
  }
  openModalRegistro(content, id, user, idRegistro) {
    this.idReservaActual = idRegistro;
    this.reservaActual = "RESERVA:" + id + " - " + user;
    this.modalService.open(content, { size: 'lg' });
    this.buscarDocumentosXacto();
  }
  buscarDocumentosXacto() {
    Swal.showLoading();
    this.api.xacto(this.fecha1).subscribe((res: any) => {
      this.documentosCabecera = res.response.documentoCabecera;
      this.documentosDetalle = res.response.documentoDetalles;
      Swal.close();
    }, err => {
      if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
      else { Swal.fire({ icon: 'warning', text: 'Hubo un error al crear el registro' }); }
    })
  }
  vincularDocumento(serie_doc, tipo_doc, fechaEmision, numeroDocumentoAdquirente, razonSocialAdquiriente, totalVenta) {
    Swal.fire({
      title: 'Esta seguro de vincular este documento?',
      showDenyButton: true,
      icon: 'warning',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'green',
      denyButtonText: `Salir`,
      reverseButtons: true
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.showLoading();
        var fecha = this.addHoursToDate(new Date(fechaEmision), -5).toISOString();
        var objVinculo = {
          "reservasid": this.idReservaActual,
          "serie_doc": serie_doc,
          "tipo_doc": tipo_doc,
          "fechaEmision": fecha,
          "numeroDocumentoAdquirente": numeroDocumentoAdquirente,
          "razonSocialAdquiriente": razonSocialAdquiriente,
          "totalVenta": totalVenta,
          "documentoDetalles": this.documentosDetalle.filter(res => res.serieNumero == serie_doc)
        }
        this.api.vincularReserva(objVinculo).subscribe((res: any) => {
          this.obtenerReservasRango('');
          Swal.fire({
            icon: 'success',
            title: 'Vinculado!',
            timer: 2000
          })
        }, err => {
          if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
          else { Swal.fire({ icon: 'warning', text: 'Hubo un error al crear el registro' }); }
        });
      }
    })


  }
  desvincular(id) {
    Swal.fire({
      title: 'Esta seguro de desvincular este documento?',
      showDenyButton: true,
      icon: 'warning',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'green',
      denyButtonText: `Salir`,
      reverseButtons: true
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.api.eliminarVinculo({ id: id }).subscribe((res) => {
          this.obtenerReservasRango('');
          this.Toast.fire({
            icon: 'success',
            title: 'Desvinculado!'
          })
        }, err => {
          if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
          else { Swal.fire({ icon: 'warning', text: 'Hubo un error al crear el registro' }); }
        });
      }
    })
  }
}
