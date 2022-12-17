import { ReservasService } from './../../core/service/reservas.service';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { timeout } from 'rxjs';
@Component({
  selector: 'app-vincular',
  templateUrl: './vincular.component.html',
  styleUrls: ['./vincular.component.scss']
})
export class VincularComponent {
  @ViewChild('modalDoc') templateRef: TemplateRef<any>;
  pgv = 0;
  pc = 0;//paginacion doc cab
  pdoc = 0; //paginacion documentos vinculados
  fecha1: string;
  fecha2: string;
  FiltroDocumento = '';
  FiltroReservaNombre = '';
  FiltroDocumentoVinculado='';
  reservas: any = [];
  restaurant_value: string = localStorage.getItem('token_restaurant');
  token: string = '';
  restaurantes: any = [];
  documentosCabecera: any = [];
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
      this.api.getRestaurantes(localStorage.getItem('token_restaurant')).subscribe((res: any) => {
        this.restaurantes = res.restaurants;
        if (res.restaurants[0].restaurant) {
          this.restaurant_value = res.restaurants[0].restaurant;
          this.obtenerReservasRango('cerrar');
        } else {
          Swal.close();
        }
      });
    var fecha = new Date();
    var fecha = this.addHoursToDate(fecha, -5);
    this.fecha1 = fecha.toJSON().slice(0, 10);
    this.fecha2 = fecha.toJSON().slice(0, 10);
  }
  obtenerReservasRango(condicion?: string) {
    return this.api.getReservasRango(this.fecha1, this.fecha1, this.restaurant_value).subscribe(res => {
      this.reservas = res;
      if (condicion == 'cerrar') Swal.close();
    },
      err => {
        if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
        else { Swal.fire({ icon: 'warning', text: 'Hubo un error al crear el registro' }); }
      }
    );
  }
  vincularAutomatico(modalDoc) {
    this.DocVinculados = [];
    this.buscarDocumentosXacto();
/*     this.modalService.open(modalDoc, { size: 'lg' }); */

    /*    console.log(this.addHoursToDate(new Date(new Date('2022-12-06 15:35:36').toISOString()), -5).toISOString()) */

    /*     console.log('2022-12-06 15:35:36') */
  }
  VincularDocAuto() {
    Swal.showLoading();
    this.api.vincularReservas(this.DocVinculados).subscribe((res) => {
      this.modalService.dismissAll()
      this.obtenerReservasRango();
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
  setTicketCover(form){
    console.log(form);
   /*  var form={
      "id_reserv": "9F4G4t",
      "items": [
          {
              "productName": "Producto A",
              "amount": "1",
              "unitPrice": "9.99",
              "totalPrice": "9.99"
          }
      ],
      "payments": [
          {
              "type": "Efectivo",
              "amount": "9.99"
          }
      ],
      "printDate": "2019-10-10 22:30:45",
      "status": "PAID",
      "total": "9.99"
    }; */
    this.api.SetTicketCover(form);
  }
  //convierte en fecha actual
  convertTime(fecha: string, horas: number) {
    var Resp = this.addHoursToDate(new Date(fecha), horas).toISOString();
    return new Date(Resp);
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
    this.api.getReservasRango(this.fecha1, this.fecha1, this.restaurant_value).subscribe(res => { this.pgv = 0; this.reservas = res; Swal.close(); }
      , err => {
        if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
        else { Swal.fire({ icon: 'warning', text: 'Hubo un error al crear el registro' }); }
      }
    );
  }
  openModalRegistro(content, id, user, idRegistro) {
    this.idReservaActual = idRegistro;
    this.reservaActual = "RESERVA:" + id + " - " + user;
    this.buscarDocumentosXacto();
    this.modalService.open(content,{ size: 'lg' })
  }
  abrirModalXacto(){
    this.buscarDocumentosXacto('modal');
  }
  buscarDocumentosXacto(modal?:string) {
    this.DocVinculados=[];
    Swal.showLoading();
    this.api.xacto(this.fecha1).subscribe((res: any) => {
      this.documentosCabecera = res.response.documento;
      //hago un recorrido a cada boleta para validar si inserto a la reserva
      for (let index = 0; index < this.documentosCabecera.length; index++) {
        const doc = this.documentosCabecera[index];
        //hago un recorrido a cada reserva para hacer la validacion con la boleta o factura
        for (let index2 = 0; index2 < this.reservas.length; index2++) {
          const vmesa = doc.mesa.split(",");
          const vmesa2 = this.reservas[index2].mesa.split(",");
          if (vmesa[0] != 'SIN' && vmesa2[0] != 'SIN' && vmesa[0] != 'TAB' && vmesa[0] != 'TAB' && vmesa2[0].includes(vmesa)) {
            var fechaFin = new Date(doc.fechaEmision).getTime();
            var fechaInicio    = new Date(this.reservas[index2].date).getTime();
            if(doc.serieNumero=='B004-00045356'){
              if(!this.reservas[index2].doc_vinculados.includes(doc.serieNumero) && fechaFin-fechaInicio<=21600000 && fechaFin>fechaInicio){}else{
                console.log(!this.reservas[index2].doc_vinculados.includes(doc.serieNumero));
                console.log(fechaFin-fechaInicio<=21600000);
                console.log(fechaFin>fechaInicio)
              }
            }

            if(!this.reservas[index2].doc_vinculados.includes(doc.serieNumero) && fechaFin-fechaInicio<=21600000 && fechaFin>fechaInicio)
               {

                const objeto = this.documentosCabecera[index];
                objeto.id_reserv = this.reservas[index2].id_reserv;
                objeto.reservasid = this.reservas[index2].id;
                objeto.serie_doc = doc.serieNumero;
                objeto.tipo_doc = doc.tipoDocumento;
                objeto.fechaEmision = doc.fechaEmision.replace(" ","T");
                objeto.numeroDocumentoAdquiriente  = doc.numeroDocumentoAdquirente;
                objeto.razonSocialAdquiriente = doc.razonSocialAdquirente;
                objeto.totalVenta = doc.totalVenta;
                objeto.user_name = doc.user_name;
                objeto.documentoDetalles=doc.detalle;
                this.DocVinculados.push(objeto);
              }
              break;
          }
        }
      }
      console.log( this.DocVinculados)
      if(modal=='modal'){
        if(this.DocVinculados.length==0){return Swal.fire({icon:'info',title:'No se econtró niguna coincidencia!'})}
        this.modalService.open(this.templateRef,{ size: 'lg' });
      }
      Swal.close();
    }, err => {
      if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
      else { Swal.fire({ icon: 'warning', text: 'Hubo un error al crear el registro' }); }
    })
  }
  vincularDocumento(serie_doc, tipo_doc, fechaEmision, numeroDocumentoAdquirente, razonSocialAdquiriente, totalVenta,detalle) {
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
          "documentoDetalles": detalle
        }
        this.api.vincularReserva(objVinculo).subscribe((res: any) => {
          this.obtenerReservasRango();
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
          this.obtenerReservasRango();
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
