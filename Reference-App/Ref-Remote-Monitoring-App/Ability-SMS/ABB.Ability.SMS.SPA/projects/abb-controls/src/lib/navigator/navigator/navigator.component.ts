import {Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from '@angular/core';
import {DataItem, FlatTreeNode} from '../navigator.models';
import {SearchResultItem} from '../../search';
import {NavigatorTreeComponent} from '../navigator-tree/navigator-tree.component';
import {NotificationsService, NotificationMessage} from '../../notifications';

@Component({
  selector: 'abb-controls-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss']
})
export class NavigatorComponent {
  public selectedTreeItem: DataItem;
  public selectedSearchResult: SearchResultItem<DataItem>;
  public isSearchActive = false;
  @Input() public leafNodeTemplate: TemplateRef<any>;
  @Input() public branchNodeTemplate: TemplateRef<any>;
  @Input() public searchItemTemplate: TemplateRef<any>;
  @Output() public selectedItemChange = new EventEmitter<DataItem>();

  private suppressTreeItemSelectionEventEmission = false;
  @ViewChild(NavigatorTreeComponent) private navigatorTreeComponent: NavigatorTreeComponent;

  constructor(private notificationsService: NotificationsService) {
  }

  public onTreeSelectionChanged(selectedTreeItem: DataItem): void {
    this.selectedTreeItem = selectedTreeItem;

    if (!this.suppressTreeItemSelectionEventEmission) {
      this.selectedItemChange.emit(selectedTreeItem);
    }
  }

  public async onIsSearchActiveChanged(isSearchActive: boolean): Promise<void> {
    this.isSearchActive = isSearchActive;

    // if changing from "search" view to "tree" view select tree item based on last search selection
    if (!isSearchActive && this.selectedSearchResult) {
      try {
        this.suppressTreeItemSelectionEventEmission = true;

        await this.navigatorTreeComponent.expandPathToAndSelectNode(this.selectedSearchResult.data);
      } catch (e) {
        this.notificationsService.send(NotificationMessage.fromHttpError(e, 'Failed to expand search node in the navigator tree'));
        this.notificationsService.send(new NotificationMessage(e.message, 'error'));
      }

      this.suppressTreeItemSelectionEventEmission = false;
    }
  }

  public onSearchResultItemClicked(searchResultItem: SearchResultItem<DataItem>, event: Event): void {
    // below should also clear this.selectedTreeItem
    this.navigatorTreeComponent.deselectCurrentNode();

    if (this.selectedSearchResult) {
      this.selectedSearchResult.isSelected = false;
    }

    this.selectedSearchResult = searchResultItem;
    this.selectedSearchResult.isSelected = true;

    this.selectedItemChange.emit(searchResultItem.data);

    if (event) {
      event.stopPropagation();
    }
  }

  public selectNode(node: FlatTreeNode, event: Event): void {
    try {
      const wasSelectionAccepted = this.navigatorTreeComponent.selectNode(node);
      if (wasSelectionAccepted && event) {
        event.stopPropagation();
      }

    } catch (e) {
      this.notificationsService.send(NotificationMessage.fromHttpError(e, 'Failed to select node in the navigator tree'));
      this.notificationsService.send(new NotificationMessage(e.message, 'error'));
    }
  }

  public async toggleNodeExpansion(node: FlatTreeNode, event: Event): Promise<void> {
    if (event) {
      event.stopPropagation();
    }

    try {
      await this.navigatorTreeComponent.toggleNodeExpansion(node);
    } catch (e) {
      this.notificationsService.send(NotificationMessage.fromHttpError(e, 'Failed to expand node in the navigator tree'));
      this.notificationsService.send(new NotificationMessage(e.message, 'error'));
    }
  }

  public async expandPathToAndSelectNode(nodeData: DataItem): Promise<void> {
    await this.navigatorTreeComponent.expandPathToAndSelectNode(nodeData);
  }

}
