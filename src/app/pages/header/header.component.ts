import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public rout:Router) { }

  ngOnInit(): void {
  }
  navegar(ruta:string){
   this.rout.navigateByUrl(ruta);
  }

  salir(){
  localStorage.removeItem('usuario');
  localStorage.removeItem('token');
  this.rout.navigateByUrl('login');
  }
}
