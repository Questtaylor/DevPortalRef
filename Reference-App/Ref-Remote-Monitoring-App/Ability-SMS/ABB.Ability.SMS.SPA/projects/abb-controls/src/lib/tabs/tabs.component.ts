import {Component, Input, OnInit, TemplateRef} from '@angular/core';

@Component({
  selector: 'abb-controls-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  public activeTab: Tab;

  @Input() public tabs: Tab[];

  constructor() {
  }

  ngOnInit() {
    const tabs = this.tabs || [];
    this.activeTab = tabs.length === 0 ? null : tabs[0];
  }

  public onTabHeaderClick(tab: Tab) {
    if (tab.isEnabled !== false) {
      this.activeTab = tab;
    }
  }
}


export class Tab {
  header: string;
  template: TemplateRef<any>;
  isEnabled?: boolean;
}
