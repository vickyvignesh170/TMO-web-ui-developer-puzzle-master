import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks,
} from '@tmo/books/data-access';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

interface SearchForm {
  term: string;
}

type SearchControl = { [key in keyof SearchForm]: AbstractControl };
type SearchFormGroup = FormGroup & {
  value: SearchForm;
  controls: SearchControl;
};

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss'],
})
export class BookSearchComponent implements OnInit, OnDestroy {
  books$: Observable<ReadingListBook[]>;
  componentDestroyed$: Subject<boolean> = new Subject();

  searchForm = this.fb.group({
    term: new FormControl(''),
  } as SearchControl) as SearchFormGroup;

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder
  ) {}

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    this.books$ = this.store.select(getAllBooks);
    this.searchForm
      .get('term')
      ?.valueChanges.pipe(
        takeUntil(this.componentDestroyed$),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => this.searchBooks());
  }

  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
  }

  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks() {
    if (!this.searchForm.value.term) this.store.dispatch(clearSearch());
    this.store.dispatch(searchBooks({ term: this.searchTerm }));
  }

  trackByFn(index: number, item: ReadingListBook) {
    return item.id;
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }
}
