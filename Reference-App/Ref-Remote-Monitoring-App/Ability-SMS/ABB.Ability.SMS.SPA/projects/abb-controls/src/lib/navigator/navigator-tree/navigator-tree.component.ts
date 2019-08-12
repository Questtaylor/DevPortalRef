import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {DataItem, FlatTreeNode} from '../navigator.models';
import {NavigatorTreeService} from './navigator-tree.service';
import {NotificationsService, NotificationMessage} from '../../notifications';

@Component({
  selector: 'abb-controls-navigator-tree',
  templateUrl: './navigator-tree.component.html',
  styleUrls: ['./navigator-tree.component.scss']
})
export class NavigatorTreeComponent implements OnInit {

  @Output() public selectedItemChanged = new EventEmitter<DataItem>();
  public initialLoadCompleted = false;
  @Input() public leafNodeTemplate: TemplateRef<any>;
  @Input() public branchNodeTemplate: TemplateRef<any>;

  private lastSelectedItem: FlatTreeNode;
  private readonly loadingPromise: Promise<void>;
  private loadingPromiseResolver: () => void;

  constructor(public navigatorTreeService: NavigatorTreeService,
              private notificationsService: NotificationsService) {

    this.loadingPromise = new Promise(resolve => {
      this.loadingPromiseResolver = resolve;
    });
  }

  public async toggleNodeExpansion(node: FlatTreeNode): Promise<void> {
    await this.navigatorTreeService.toggleNode(node, !node.isExpanded);
  }

  public deselectCurrentNode(): void {
    if (this.lastSelectedItem) {
      this.navigatorTreeService.toggleNodeSelection(this.lastSelectedItem, false);
      this.lastSelectedItem = null;
    }
  }

  public selectNode(node: FlatTreeNode): boolean {
    if (!node || !node.isSelectable) {
      return false;
    }

    this.deselectCurrentNode();

    this.lastSelectedItem = node;
    this.navigatorTreeService.toggleNodeSelection(node, true);

    this.selectedItemChanged.next(node.data);
    return true;
  }

  public ngOnInit(): void {
    this.navigatorTreeService.init().then(m => {
      this.initialLoadCompleted = true;
    }).catch(reason => {
        this.notificationsService.send(NotificationMessage.fromHttpError(reason, 'Navigator tree initialization failed'));
        this.notificationsService.send(new NotificationMessage(reason, 'error'));
      }
    ).then(() => this.loadingPromiseResolver());
  }

  public async expandPathToAndSelectNode(nodeData: DataItem): Promise<void> {
    await this.loadingPromise;

    const leafNode = await this.navigatorTreeService.expandPathToAndSelectNode(nodeData);
    this.selectNode(leafNode);
  }
}
