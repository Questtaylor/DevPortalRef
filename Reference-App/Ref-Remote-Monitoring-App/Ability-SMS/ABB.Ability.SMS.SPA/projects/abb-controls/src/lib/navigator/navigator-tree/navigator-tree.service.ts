import {DataItem, FlatTreeNode} from '../navigator.models';
import {Observable} from 'rxjs';

export abstract class NavigatorTreeService {

  /**
   * Fetch a flat list to display
   */
  public abstract get data$(): Observable<FlatTreeNode[]>;

  public abstract init(): Promise<void>;

  /**
   * Toggle the node, add/remove children from display list
   */
  public abstract toggleNode(node: FlatTreeNode, expand: boolean): Promise<void>;

  public abstract expandPathToAndSelectNode(nodeData: DataItem): Promise<FlatTreeNode>;

  public abstract toggleNodeSelection(node: FlatTreeNode, isSelected: boolean): void;
}
