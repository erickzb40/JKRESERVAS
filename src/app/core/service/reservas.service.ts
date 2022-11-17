import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  localhost='https://localhost:7023/';
  token='lrgWUpXa4Zu0cygU3NIL';
  covermanager='https://www.covermanager.com/api/restaurant/get_reservs/'+this.token;
  tokenlocalstorage=localStorage.getItem('token');
  constructor(public http:HttpClient) { }
  getReservas(){
    return this.http.get(this.localhost+'api/reservas?token='+this.tokenlocalstorage);
  }
  buscarReservas(obj:any){
    return this.http.get(this.covermanager+'/'+obj.restaurant+'/'+obj.date_start+'/'+obj.date_end+'/0');
  }
  insertarReservasPendientes(form:any,restaurant:string){
    return this.http.post(this.localhost+'api/reservas/update'+'?Restaurant='+restaurant+'&token='+this.tokenlocalstorage, form,
    {responseType: 'text'});
  }
  getRestaurantes(){
    return this.http.get('https://www.covermanager.com/api/restaurant/list/'+this.token);
  }
  updateReservas(form:any){
    return this.http.put(this.localhost+'api/reservas?token='+this.tokenlocalstorage,form);
  }
  getReservasRango(desde:any,hasta:any){
    return this.http.get(this.localhost+'api/reservas/rango?fecha1='+desde+'&fecha2='+hasta+'&token='+this.tokenlocalstorage);
  }
  login(usuario:object){
    return this.http.post(this.localhost+'api/Usuario/login',usuario);
  }
  crearReserva(form:any){
    return this.http.post(this.localhost+'api/reservas/create?token='+this.tokenlocalstorage,form);
    }
    xacto(){
      var form={
        "localId":97,
        "fechaInicio":"2022-10-20",
        "fechaFin":"2022-10-20"}
      return this.http.post('http://api.xactoperu.com:6099/api/documentocabeceras/covermanager',form);
    }
}
