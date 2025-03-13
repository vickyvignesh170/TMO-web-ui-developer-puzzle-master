import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map } from 'rxjs/operators';
import { ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';


@Injectable()
export class ReadingListEffects implements OnInitEffects {
  _storeSnapshot$: Store;
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http.get<ReadingListItem[]>('/api/reading-list').pipe(
          map((data) =>
            ReadingListActions.loadReadingListSuccess({ list: data })
          ),
          catchError((error) =>
            of(ReadingListActions.loadReadingListError({ error }))
          )
        )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book }) =>
      {
        return this.http.post('/api/reading-list', book).pipe(
          map(() => ReadingListActions.confirmedAddToReadingList({ book })),
          catchError(() =>
            of(ReadingListActions.failedAddToReadingList({ book }))
          )
        )
      }
      )
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item }) =>
        this.http.delete(`/api/reading-list/${item.bookId}`).pipe(
          map(() =>
            ReadingListActions.confirmedRemoveFromReadingList({ item })
          ),
          catchError(() =>
            of(ReadingListActions.failedRemoveFromReadingList({ item }))
          )
        )
      )
    )
  );

  confirmedAddToReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.confirmedAddToReadingList),
      map((action) => {
        const _snackBar = this.snackBar.open(`Added ${action.book.title} to your reading list`, 'Undo', {
          duration: 5000,
        });

        _snackBar.onAction().subscribe(() => this.store.dispatch(ReadingListActions.undoAddToReadingList(action)));
      })
    ), { dispatch: false}
  );

  confirmedRemoveFromReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.confirmedRemoveFromReadingList),
      map((action) => {
        const _snackBar = this.snackBar.open(`Removed ${action.item.title} from your reading list`, 'Undo', {
          duration: 5000,
        });

        _snackBar.onAction().subscribe(() => this.store.dispatch(ReadingListActions.undoRemoveFromReadingList(action)));
      })
    ), { dispatch: false}
  )

  undoAddToReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.undoAddToReadingList),
      map((action) => { 
        this.store.dispatch(ReadingListActions.removeFromReadingList({ item: { bookId: action.book?.id, title: action.book.title, authors: action.book.authors, description: action.book.description } }))
       })
    ), { dispatch: false}
  );

  undoRemoveFromReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.undoRemoveFromReadingList),
      map((action) => { 
        console.log(action);
        this.store.dispatch(ReadingListActions.addToReadingList({ book: { id: action.item.bookId, title: action.item.title, authors: action.item.authors, description: action.item.description } })) })
    ), { dispatch: false}
  );

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(private actions$: Actions, private http: HttpClient, private snackBar: MatSnackBar, private store: Store) {}
}
