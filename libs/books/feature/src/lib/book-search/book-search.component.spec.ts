import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule } from '@tmo/shared/testing';
import {MockStore} from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
import {
  clearSearch,
  searchBooks
} from '@tmo/books/data-access';

describe('ProductsListComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let store : MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule]
    }).compileComponents();
    store = TestBed.inject(Store) as MockStore
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should dispatch searchBook after debounce time', fakeAsync(() => { 
    const dispatchSpy = spyOn(store, 'dispatch'); 
    const searchTerm = 'Javascript'; 

    component.searchForm.get('term').setValue(searchTerm); 

    tick(500); 

    expect(dispatchSpy).toHaveBeenCalledWith(searchBooks({ term: searchTerm })); 
  }));

  it('should dispactch only after 500ms', fakeAsync(() => { 
    const dispatchSpy = spyOn(store, 'dispatch'); 
    const searchTerm = 'Javascript'; 

    component.searchForm.get('term').setValue(searchTerm.slice(0, 3)); 

    tick(200); 

    component.searchForm.get('term').setValue(searchTerm); 

    tick(500); 

    expect(dispatchSpy).toHaveBeenCalledTimes(1); 
    expect(dispatchSpy).toHaveBeenCalledWith(searchBooks({ term: searchTerm })); 
  }));

    it('should dispatch clearSearch when the input is cleared', fakeAsync(() => { 
      const dispatchSpy = spyOn(store, 'dispatch'); 
      component.searchForm.get('term').setValue('Javascript'); 

      tick(500); 

      component.searchForm.get('term').setValue(''); 

      tick(500); 

      expect(dispatchSpy).toHaveBeenCalledWith(clearSearch()); 
    }));
});
