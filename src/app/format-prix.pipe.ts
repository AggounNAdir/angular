import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPrix',
  standalone: true // ✅ Rend le pipe utilisable dans les composants standalone

})
export class FormatPrixPipe implements PipeTransform {
  transform(value: number): string {
    if (value === null || isNaN(value)) {
      return '';
    }
    return value.toFixed(2); // Formate le nombre avec 2 décimales
  }
}