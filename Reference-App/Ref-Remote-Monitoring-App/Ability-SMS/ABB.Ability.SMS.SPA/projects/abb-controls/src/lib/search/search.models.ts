export class SearchResultItem<T> {
  public isSelected = false;

  constructor(public id: any, public label: string, public data: T) {
  }
}
