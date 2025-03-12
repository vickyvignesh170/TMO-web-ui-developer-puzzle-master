import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getReadingList, removeFromReadingList } from '@tmo/books/data-access';
import { Book } from '@tmo/shared/models';
import { Observable } from 'rxjs';

type ReadingListItem = Omit<Book, 'id'> & { bookId: string };
type ReadingList = Observable<ReadingListItem[]>;

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent {
  readingList$: ReadingList = this.store.select(getReadingList);

  constructor(private readonly store: Store) {}

  removeFromReadingList(item: ReadingListItem) {
    this.store.dispatch(removeFromReadingList({ item }));
  }

  trackByFn(index: number, item: ReadingListItem) {
    return item.bookId;
  }
}
