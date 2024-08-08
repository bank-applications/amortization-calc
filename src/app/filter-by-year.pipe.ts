import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByYear'
})
export class FilterByYearPipe implements PipeTransform {
  transform(items: any[], year: number): any[] {
    if (!items || !year) {
      return items;
    }
    return items.filter(item => new Date(item.date).getFullYear() === year);
  }
}
