### Code review:

    - TrackBy can be used to optimze the redering in ngFor. Helps in better performance.

    - In the `book-search.component.ts` subscription to the store is not cleared when component is removed. 
    solution: It can be done by piping the subscription with takeUntil operator and on ngDestroy we can clear the subscriptions. Or save it as observable and use it in the template with async pipe. This helps prevent memory leak.

    - The searchForm in `book-search.component.ts` doesn't have formControl, the value is directly assigned to empty quotes.
    solution: adding formControl to terms in the form group.
    (note: creating an entire formgroup for a single input is a bit extravagant)

    - The `searchBooks()` function can be re-written using best practices.
    solution:  Performing the null check first and dispatching the `clearSearch()` action. Makes the code sleeker.

    - Type aliasing was missing in `reading-list.component.ts` file.

## Improvements

    - Search book input could provide suggestions based on what the user types.

    - Inferring of types can be done better, I see some variables having type as any.

    - Can avoid using fromgroups for a single input value. It can be retrieved by any simple javascript events methods.
    
    - There are multiple render cycles happening, refer to the screenshot below. This can be optimized by either going through the state update or using some changeDetection startegy.
    ![re-rendering](<Screenshot 2025-03-13 015304.png>)


### Accessibility issues:

## Lighthouse detected issues:
    - Attached the result of lighthouse scan as json in a file named TMO-lighthouse-results.json.

## Issue not found by automated scan:
    - The navbar and Reading list button don't have any contrast. It doesn't indicate as a button to the user.
    - My Reading list heading can be in bold.


    

