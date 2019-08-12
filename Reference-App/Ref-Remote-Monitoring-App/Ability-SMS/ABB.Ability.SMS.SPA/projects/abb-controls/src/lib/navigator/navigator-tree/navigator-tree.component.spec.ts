import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NavigatorTreeComponent} from './navigator-tree.component';
import {DataLoaderModule} from '../../data-loader';
import {SearchModule} from '../../search';
import {NavigatorTreeService} from './navigator-tree.service';
import {DataItem, FlatTreeNode} from '../navigator.models';
import {By} from '@angular/platform-browser';
import {NotificationsService} from '../../notifications';
import {from, Observable} from 'rxjs';

class NavigatorTreeServiceMock extends NavigatorTreeService {
  get data$(): Observable<FlatTreeNode[]> {
    return undefined;
  }

  expandPathToAndSelectNode(nodeData: DataItem): Promise<FlatTreeNode> {
    return undefined;
  }

  init(): Promise<void> {
    return undefined;
  }

  toggleNode(node: FlatTreeNode, expand: boolean): Promise<void> {
    return undefined;
  }

  toggleNodeSelection(node: FlatTreeNode, isSelected: boolean): void {
  }

}

describe('NavigatorTreeComponent', () => {
  let fixture: ComponentFixture<NavigatorTreeComponent>;
  let component: NavigatorTreeComponent;

  const navigatorTreeService: NavigatorTreeService = new NavigatorTreeServiceMock();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DataLoaderModule,
        SearchModule
      ],
      declarations: [
        NavigatorTreeComponent
      ],
      providers: [
        {
          provide: NavigatorTreeService,
          useValue: navigatorTreeService
        },
        NotificationsService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigatorTreeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.debugElement.componentInstance).toBeTruthy();
  });

  it('should load initial data and display it', (done: DoneFn) => {
    const expectedRootData = [
      new FlatTreeNode(new DataItem(1, 'one', 'model'), 0, false, false),
      new FlatTreeNode(new DataItem(2, 'two', 'model'), 0, true, false)
    ];

    const navigatorTreeServiceInitSpy = spyOn(navigatorTreeService, 'init').and.returnValue(Promise.resolve());
    const navigatorTreeServiceDataSpy = spyOnProperty(navigatorTreeService, 'data$', 'get').and.returnValue(from([expectedRootData]));

    //initial state
    expect(component.initialLoadCompleted).toBe(false);
    expect(navigatorTreeServiceInitSpy).not.toHaveBeenCalled();
    expect(navigatorTreeServiceDataSpy).not.toHaveBeenCalled();

    //simulate component initialization
    component.ngOnInit();

    //assert end state
    expect(navigatorTreeServiceInitSpy).toHaveBeenCalled();

    navigatorTreeServiceInitSpy.calls.mostRecent().returnValue.then(() => {
      expect(component.initialLoadCompleted).toBe(true);
      expect(navigatorTreeServiceDataSpy).not.toHaveBeenCalled();

      fixture.detectChanges();
      expect(navigatorTreeServiceDataSpy).toHaveBeenCalled();

      //check UI
      const childrenDivs = fixture.debugElement.queryAll(By.css('.node-container div'));
      expect(childrenDivs.length).toBe(expectedRootData.length);

      done();
    }).catch(error => done.fail(error));

    expect(component.initialLoadCompleted).toBe(false);
  });
});
