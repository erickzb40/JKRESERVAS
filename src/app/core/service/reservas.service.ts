import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  localhost='https://jk-smart.com:84/';
  //localhost = 'https://localhost:7023/';
  constructor(public http: HttpClient) { }

  buscarReservas(obj: any, token: any) {
    var covermanager = 'https://www.covermanager.com/api/restaurant/get_reservs/' + token;
    return this.http.get(covermanager + '/' + obj.restaurant + '/' + obj.date_start + '/' + obj.date_end + '/0');
  }
  insertarReservasPendientes(form: any, restaurant: string) {
    var tokenlocalstorage = localStorage.getItem('token');
    return this.http.post(this.localhost + 'api/reservas/update' + '?Restaurant=' + restaurant, form,
      {
        headers: { 'token': tokenlocalstorage }
      });
  }
  getRestaurantes(token: any) {
    return this.http.get('https://www.covermanager.com/api/restaurant/list/' + token);
  }
  updateReservas(form: any) {
    var tokenlocalstorage = localStorage.getItem('token');
    return this.http.put(this.localhost + 'api/reservas', form, {
      headers: { 'token': tokenlocalstorage }
    });
  }
  getReservasRango(desde: any, hasta: any, restaurante: any) {
    var tokenlocalstorage = localStorage.getItem('token');
    return this.http.get(this.localhost + 'api/reservas/rango?fecha1=' + desde + '&fecha2=' + hasta + '&restaurant=' + restaurante,
      {
        headers: { 'token': tokenlocalstorage }
      });
  }
  login(usuario: object) {
    return this.http.post(this.localhost + 'api/Usuario/login', usuario);
  }
  crearReserva(form: any) {
    var tokenlocalstorage = localStorage.getItem('token');
    return this.http.post(this.localhost + 'api/reservas/create', form, {
      headers: { 'token': tokenlocalstorage }
    });
  }
  xacto(fechaInicio: string) {
    return this.http.get(this.localhost+'api/Xacto?fechaInicio=' + fechaInicio);
  }
  /*   xacto(){
        var form={
          "localId":97,
          "fechaInicio":"2022-10-20",
          "fechaFin":"2022-10-20"}
        return this.http.post('http://api.xactoperu.com:6099/api/documentocabeceras/covermanager',form);
    } */
  //obtengo el token asignado en la tabla local del usuario logeado
  obtenerPermisoToken() {
    var tokenlocalstorage = localStorage.getItem('token');
    return this.http.get(this.localhost + 'api/Usuario/permiso', {
      headers: { 'token': tokenlocalstorage }
    });
  }
  vincularReserva(form:any){
    var tokenlocalstorage=localStorage.getItem('token');
    return this.http.post(this.localhost+'api/reservas/vincular',form,{
      headers: {'token':tokenlocalstorage}
    });
  }
  eliminarVinculo(form:any){
    var tokenlocalstorage = localStorage.getItem('token');
    return this.http.post(this.localhost + 'api/reservas/eliminarVinculo',form, {
      headers: { 'token': tokenlocalstorage }
    });
  }
  getReservasRangoSentado(desde: any, hasta: any, restaurante: any) {
    var tokenlocalstorage = localStorage.getItem('token');
    return this.http.get(this.localhost + 'api/reservas/sentados?fecha1=' + desde + '&fecha2=' + hasta + '&restaurant=' + restaurante,
      {
        headers: { 'token': tokenlocalstorage }
      });
  }
}
