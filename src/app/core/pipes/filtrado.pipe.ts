import { VincularComponent } from './../../pages/vincular/vincular.component';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FiltradoPipe implements PipeTransform {
  constructor(public vc:VincularComponent){

  }
  transform(items: any[], keyword: any, properties: string[]): any[] {
    this.vc.pgv=0;
    this.vc.pdoc=0;
    this.vc.pc=0;
    if (!items) return [];
    if (!keyword) return items;
    return items.filter(item => {
      var itemFound: Boolean;
      for (let i = 0; i < properties.length; i++) {
        if (item[properties[i]].toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
          itemFound = true;
          break;
        }
      }
      return itemFound;
    });

  }

}
