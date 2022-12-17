import { TableComponent } from './../../pages/dashboard/table/table.component';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroReservaMain'
})
export class FiltroReservaMainPipe implements PipeTransform {
 constructor(public tc:TableComponent){

 }
  transform(value: any, arg: any): any {
    this.tc.pages=0
    const resultPosts = [];
    for(const post of value){
      if((post.user_name).toLowerCase().indexOf(arg) > -1){
         resultPosts.push(post);
      };
    };
    return resultPosts;
  }
}
