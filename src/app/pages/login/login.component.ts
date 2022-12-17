
import { ReservasService } from '../../core/service/reservas.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { trim } from 'lodash';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public auth:ReservasService,public router:Router) { }

  usuario = {
    nombreUsuario: '',
    contrasena: '',
    empresa:''
  }
  recordarme = false;
  @ViewChild("login") login_input: ElementRef;
  ngOnInit(): void {
    if (localStorage.getItem('user')) {
      this.usuario.empresa=localStorage.getItem('emp');
      this.usuario.nombreUsuario = localStorage.getItem('user');
      this.recordarme=true;
    }
  }

  login(form: NgForm) {
    if (form.invalid) { return; }
    var formulario:any=this.usuario;
    formulario.empresa=trim(formulario.empresa).toLowerCase();
    formulario.nombreUsuario=trim(formulario.nombreUsuario).toLowerCase();
    formulario.contrasena=trim(formulario.contrasena).toLowerCase();
    Swal.showLoading();
    this.auth.login(formulario).subscribe((res:any) => {
    this.validarUsuario(res);
    }, err => {
      Swal.fire({ icon: 'warning', text: 'hubo un error en la conexion al servidor' });
    });

  }

/*   this.api.obtenerPermisoToken().subscribe((res: any) => {
    this.token = res[0].token;} */
  validarUsuario(res:any){
    if (Object.entries(res).length > 0) {
      res=res[0];
      if (this.recordarme) {
        localStorage.setItem('user', this.usuario.nombreUsuario);
        localStorage.setItem('emp', this.usuario.empresa.toLowerCase());
      }else{
        localStorage.removeItem('user');
        localStorage.removeItem('emp');
      }
      Swal.close();
      localStorage.setItem('token_restaurant',res.token_restaurant)
      localStorage.setItem('token',res.token);
      localStorage.setItem('emp',this.usuario.empresa.toLowerCase());
      console.log('llego')
      return this.router.navigateByUrl('dashboard');
    } else {
      Swal.fire({
        title: 'Mensaje',
        icon: 'warning',
        text: 'No se encontro ningun usuario'
      })
    }
  }

}
