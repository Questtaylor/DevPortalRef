import {SearchResultItem} from './search.models';

export abstract class SearchService {
  public abstract search(text: string): Promise<SearchResultItem<any>[]>;
}
