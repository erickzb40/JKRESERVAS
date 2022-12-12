import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringToDateService {

  constructor() { }

  public StringToDate(arreglo:any){
     arreglo.forEach(element => {
      var [year_add,month_add,day_add] = element.date_add.split('-');
      var [hours_add, minutes_add, seconds_add] = element.time_add.split(':');
      element.date_add=new Date(+year_add, +month_add - 1, +day_add, +hours_add-5, +minutes_add, +seconds_add).toISOString();
      var [year,month,day] = element.date.split('-');
      var [hours, minutes] = element.time.split(':');
      element.date=new Date(year, month - 1, day, hours-5, minutes).toISOString();
      element.mesa=element.tables;
      element.pax=element.for;
    });
    return arreglo;
  }
}
