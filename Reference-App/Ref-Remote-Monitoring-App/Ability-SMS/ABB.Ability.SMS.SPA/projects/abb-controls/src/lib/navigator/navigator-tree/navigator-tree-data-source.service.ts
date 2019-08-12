import { DataItem, FlatTreeNode } from '../navigator.models';

export abstract class NavigatorTreeDataSourceService {
  public abstract init(): void;

  public abstract forceReloadChildrenOfNode(node: FlatTreeNode): Promise<FlatTreeNode[]>;

  public abstract getRootData(): Promise<FlatTreeNode[]>;

  public abstract getChildren(node: FlatTreeNode, includeAllChildrenRecursively: boolean): Promise<FlatTreeNode[]>;

  public abstract getPathToNode(nodeData: DataItem): Promise<any[]>;
}
