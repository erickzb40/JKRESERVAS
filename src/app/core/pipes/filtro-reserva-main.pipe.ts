import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroReservaMain'
})
export class FiltroReservaMainPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultPosts = [];
    for(const post of value){
      if((post.user_name).toLowerCase().indexOf(arg) > -1){
         resultPosts.push(post);
      };
    };
    return resultPosts;
  }
}
