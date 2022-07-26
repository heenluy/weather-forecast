import { Component, OnInit, OnDestroy, ComponentFactoryResolver, ApplicationRef, Injector } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PortalOutlet, DomPortalOutlet, ComponentPortal } from '@angular/cdk/portal';

import { Store } from '@ngrx/store';
import { Observable, takeUntil, Subject, combineLatest, map } from 'rxjs';

import { CityWeather } from '../../../../shared/models/weather.model';
import { CityTypeaheadItem } from '../../../../shared/models/city-typeahead-item.model';
import { Units } from '../../../../shared/models/units.enum';
import { Bookmark } from '../../../../shared/models/bookmark.model';
import { UnitSelectorComponent } from '../unit-selector/unit-selector.component';

import * as fromHomeActions from '../../state/home.actions';
import * as fromHomeSelectors from '../../state/home.selectors';
import * as fromBookmarksSelectors from '../../../bookmarks/state/bookmarks.selectors';
import * as fromConfigSelectors from '../../../../shared/state/config/config.selectors';


@Component({
  selector: 'home-page',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {

  cityWeather: CityWeather | any;
  searchControl!: FormControl;
  searchControlWithAutocomplete!: FormControl;

  loading$!: Observable<boolean>;
  error$!: Observable<boolean>;

  cityWeather$!: Observable<CityWeather>;
  bookmarkList$!: Observable<Bookmark[]>;
  isCurrentFavorite$!: Observable<boolean>;
  unit$!: Observable<Units>;

  private componentDestroyed$ = new Subject();
  private portalOutlet!: PortalOutlet;

  constructor(
    private store: Store,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
  ){}

  ngOnInit(): void {
    this.searchControl = new FormControl('', [ Validators.required ]);
    this.searchControlWithAutocomplete = new FormControl(undefined);

    this.loading$ = this.store.select(fromHomeSelectors.selectCurrentWeatherLoading);
    this.error$ = this.store.select(fromHomeSelectors.selectCurrentWeatherError);
    this.cityWeather$ = this.store.select(fromHomeSelectors.selectCurrentWeather);

    this.bookmarkList$ = this.store.select(fromBookmarksSelectors.selectBookmarkList);

    this.searchControlWithAutocomplete.valueChanges
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((value: CityTypeaheadItem) => {
        if(!!value) {
          this.store.dispatch(fromHomeActions.loadCurrentWeather({ query: value.name }))
        }
        this.store.select(fromHomeSelectors.selectCurrentWeather)
          .subscribe(entity => this.cityWeather = entity);
      })

    this.isCurrentFavorite$ = combineLatest([this.cityWeather$, this.bookmarkList$])
      .pipe(map(([current, list]) => {
        if(!!current) {
          return list.some(bmk => bmk.id === current.city.id);
        }
        return false;
      }));

    this.unit$ = this.store.select(fromConfigSelectors.selectUnitConfig);

    this.setUpPortal();
  }

  ngOnDestroy(): void {
    this.store.dispatch(fromHomeActions.clearHomeState());
    this.searchControl.reset;
    this.componentDestroyed$.next([]);
    this.componentDestroyed$.unsubscribe();
    this.portalOutlet.detach();
  }

  doSearch(): void {
    const query = this.searchControl.value;
    this.store.dispatch(fromHomeActions.loadCurrentWeather({ query }));
    this.store.select(fromHomeSelectors.selectCurrentWeather)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(entity => this.cityWeather = entity);
  }

  onToggleBookmark() {
    const bookmark = new Bookmark();
    bookmark.id = this.cityWeather.city.id;
    bookmark.name = this.cityWeather.city.name;
    bookmark.country = this.cityWeather.city.country;
    bookmark.coord = this.cityWeather.city.coord;

    this.store.dispatch(fromHomeActions.toggleBookmark({ entity: bookmark }));
  }

  private setUpPortal(): void {
    const element = document.querySelector('#navbar-portal-outlet')!;

    this.portalOutlet = new DomPortalOutlet(
      element,
      this.componentFactoryResolver,
      this.appRef,
      this.injector
    );

    this.portalOutlet.attach(new ComponentPortal(UnitSelectorComponent));
  }

}
