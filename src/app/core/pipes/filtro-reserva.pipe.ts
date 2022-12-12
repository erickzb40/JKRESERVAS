import { VincularComponent } from './../../pages/vincular/vincular.component';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroReserva'
})
export class FiltroReservaPipe implements PipeTransform {
  constructor(public vc:VincularComponent){

  }
  transform(value: any, arg: any): any {
    const resultPosts = [];
    for(const post of value){
      if((post.user_name).toLowerCase().indexOf(arg) > -1){
         resultPosts.push(post);
      };
    };
    this.vc.pgv=0;
    return resultPosts;
  }
}
