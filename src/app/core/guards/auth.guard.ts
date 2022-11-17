import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private ruta :Router){
  }

    canActivate() {
      if(localStorage.getItem('token')){
       return true;
      }else{
      return this.ruta.navigateByUrl('login');
      }
    }

}
