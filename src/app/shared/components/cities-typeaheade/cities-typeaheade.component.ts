import { Component, OnInit, Optional, Self, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

import {
  Observable,
  switchMap,
  Subject,
  concat,
  of,
  distinctUntilChanged,
  tap,
  catchError
} from 'rxjs';

import { CitiesService } from '../../services/cities.service';
import { CityTypeaheadItem } from '../../models/city-typeahead-item.model';
import { ThemeService } from '../../services/theme.service';


@Component({
  selector: 'app-cities-typeaheade',
  templateUrl: './cities-typeaheade.component.html',
  styleUrls: ['./cities-typeaheade.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CitiesTypeaheadeComponent implements OnInit, ControlValueAccessor {

  dataSource$!: Observable<CityTypeaheadItem[]>;
  input$ = new Subject<string>();

  selectedItem!: CityTypeaheadItem;
  disabled: boolean = false;
  loading: boolean = false;

  private onChange!: (value: CityTypeaheadItem) => void;
  private onTouched!: () => void;

  constructor(
    private citiesService: CitiesService,
    private theme: ThemeService,
    @Optional() @Self() public control: NgControl
  ) {
    this.control.valueAccessor = this;
  }

  ngOnInit(): void {
    this.dataSource$ = concat(
      of([]),
      this.input$.pipe(
        distinctUntilChanged(),
        tap(() => this.loading = true),
        switchMap((key: string) => this.citiesService.getCities(key).pipe(
          catchError(() => of([])),
          tap(() => this.loading = false),
        ))
      )
    )

  }

  get darkStyle(): string {
    return this.theme.current === 'light' ? '' : 'dark';
  }

  onSelected() {
    this.onTouched();
    this.onChange(this.selectedItem);
  }

  registerOnChange(fn: (value: CityTypeaheadItem) => void ) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  writeValue() {

  }

}
