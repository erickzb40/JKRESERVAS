import { VincularComponent } from './../../pages/vincular/vincular.component';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroDoc'
})
export class FiltroDocPipe implements PipeTransform {
  constructor(public vc:VincularComponent){

  }
  transform(value: any, arg: any): any {
    const resultPosts = [];
    for(const post of value){
      if(post.serieNumero.toLowerCase().indexOf(arg) > -1){
         resultPosts.push(post);
      };
    };
    this.vc.pc=0;
    return resultPosts;
  }


}
