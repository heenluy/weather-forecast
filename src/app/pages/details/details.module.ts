import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { detailsReducer } from './state/details.reducer';
import { DetailsEffects } from './state/details.effects';

import { DetailsPage } from './containers/details/details.page';
import { DetailsGuard } from './services/details.guard';
import { DailyWeatherComponent } from './components/daily-weather/daily-weather.component';
import { ComponentsModule } from '../../shared/components/components.module';



@NgModule({
  declarations: [
    DetailsPage,
    DailyWeatherComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild([
      {
        path: '',
        component: DetailsPage,
        title: 'Cloudy App — Detalhes',
        canActivate: [DetailsGuard]
      }
    ]),
    StoreModule.forFeature('details', detailsReducer),
    EffectsModule.forFeature([DetailsEffects])
  ],
  providers: [
    DetailsGuard
  ]
})
export class DetailsModule { }
