import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { Weather } from  '../../../shared/models/weather.model';
import { Units } from  '../../../shared/models/units.enum';
import { unitToSymbol } from  '../../../shared/utils/units.utils';


@Component({
  selector: 'app-detailed-weather',
  templateUrl: './detailed-weather.component.html',
  styleUrls: ['./detailed-weather.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailedWeatherComponent {

  @Input() weather!: Weather;
  @Input() unit!: Units;

  constructor() { }

  get weatheIcon(): string {
    return `http://openweathermap.org/img/wn/${ this.weather.icon }@2x.png`;
  }

  get unitSymbol() {
    return unitToSymbol(this.unit);
  }

}
