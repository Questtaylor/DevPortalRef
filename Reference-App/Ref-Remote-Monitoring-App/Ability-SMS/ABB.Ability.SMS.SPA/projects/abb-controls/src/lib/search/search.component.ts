import {Component, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import {SearchService} from './search.service';
import {SearchResultItem} from './search.models';
import {DataItem} from '../navigator';
import {NotificationsService, NotificationMessage} from '../notifications';

@Component({
  selector: 'abb-controls-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  @Output() public isSearchActiveChanged = new EventEmitter<boolean>();
  public isSearchActive = false;
  public isSearchLoading = false;
  public searchResults: SearchResultItem<DataItem>[] = [];
  @Input() public searchBarPlaceholder = 'Search';
  @Input() public searchItemTemplate: TemplateRef<any>;

  constructor(private searchService: SearchService, private notificationsService: NotificationsService) {
  }

  public async onSearchTextChanged(text: string): Promise<void> {
    try {
      const isSearchActive = !!text;
      this.isSearchActive = isSearchActive;
      this.isSearchActiveChanged.emit(isSearchActive);

      if (isSearchActive) {
        this.isSearchLoading = true;
        //clear previous results
        this.searchResults = [];
        this.searchResults = await this.searchService.search(text);
        this.isSearchLoading = false;
      } else {
        this.searchResults = [];
        this.isSearchLoading = false;
      }
    } catch (e) {
      this.notificationsService.send(NotificationMessage.fromHttpError(e, 'Search failed'));
      this.notificationsService.send(new NotificationMessage(e.message, 'error'));
    }
  }
}
