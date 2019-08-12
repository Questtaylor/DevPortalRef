import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {DataItem, FlatTreeNode} from '../navigator.models';
import {SearchResultItem} from '../../search';
import {NavigatorTreeComponent} from '../navigator-tree/navigator-tree.component';
import {NotificationsService, NotificationMessage} from '../../notifications';
@Component({
    selector: 'abb-controls-navigator-table',
    templateUrl: 'navigator-table.component.html'
})

export class NavigatorTableComponent implements OnInit {
    public isSearchActive = false;

    constructor(private notificationsService: NotificationsService) {
    }

    ngOnInit() { }

    public async onIsSearchActiveChanged(isSearchActive: boolean): Promise<void> {
        this.isSearchActive = isSearchActive;

        // if changing from "search" view to "tree" view select tree item based on last search selection
        if (!isSearchActive) {
          try {
            // this.suppressTreeItemSelectionEventEmission = true;

            // await this.navigatorTreeComponent.expandPathToAndSelectNode(this.selectedSearchResult.data);
          } catch (e) {
            this.notificationsService.send(NotificationMessage.fromHttpError(e, 'Failed to expand search node in the navigator tree'));
            this.notificationsService.send(new NotificationMessage(e.message, 'error'));
          }

          // this.suppressTreeItemSelectionEventEmission = false;
        }
    }
    public onSearchResultItemClicked(searchResultItem: SearchResultItem<DataItem>, event: Event): void {
        // below should also clear this.selectedTreeItem
        // this.navigatorTreeComponent.deselectCurrentNode();

        // if (this.selectedSearchResult) {
        //   this.selectedSearchResult.isSelected = false;
        // }

        // this.selectedSearchResult = searchResultItem;
        // this.selectedSearchResult.isSelected = true;

        // this.selectedItemChange.emit(searchResultItem.data);

        if (event) {
          event.stopPropagation();
        }
    }
}
