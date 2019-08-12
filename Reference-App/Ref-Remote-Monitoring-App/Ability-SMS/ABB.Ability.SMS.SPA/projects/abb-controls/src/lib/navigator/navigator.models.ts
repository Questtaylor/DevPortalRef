export class DataItem {
  constructor(public id: any, public label: string, public type: 'model' | 'type' | 'instance', public rawData: any = null, public isDummy: boolean = false) {
  }
}

export class FlatTreeNode {
  constructor(public data: DataItem, public level: number, public expandable: boolean, public isSelectable: boolean,
              public isLoading: boolean = false, public isSelected: boolean = false, public isExpanded: boolean = false) {
  }
}

export const rootNodeLevel = 0;
