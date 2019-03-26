import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { IsTablePaginator } from './table-paginator';
import { NgbTooltipModule, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

describe('IsTablePaginator', () => {
  let component: IsTablePaginator;
  let fixture: ComponentFixture<IsTablePaginator>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IsTablePaginator],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        NgbTooltipConfig
      ],
      imports: [NgbTooltipModule]
    })
      .compileComponents().then(() => {
      fixture = TestBed.createComponent(IsTablePaginator);
      fixture.detectChanges();
      component = fixture.componentInstance;
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {

    beforeEach(() => {
      component.collectionSize = 45;
      component.pageSize = 10;
      spyOn(component, 'getTotalPages').and.callThrough();
      const simpleChange = {};
      component.ngOnChanges(simpleChange);
    });

    it('should call getTotalPages and set totalNumPages', () => {
      expect(component.totalNumPages).toBe(5);
      expect(component.getTotalPages).toHaveBeenCalled();
    });
  });

  describe('goToPage', () => {

    beforeEach(() => {
      component.currentPage = 2;
      spyOn(component.currentPageChange, 'emit').and.callThrough();
      spyOn(component.pageChange, 'emit').and.callThrough();
    });

    it('should go to new page if currentPage is not equal to parameter', () => {
      component.goToPage(3);
      fixture.whenStable().then(() => {
        fixture.detectChanges();
      });
      expect(component.pageChange.emit).toHaveBeenCalled();
      expect(component.currentPageChange.emit).toHaveBeenCalled();
      expect(component.currentPage).toEqual(3);
    });


    it('should not go to new page if currentPage is equal to parameter', () => {
      component.goToPage(2);
      fixture.whenStable().then(() => {
        fixture.detectChanges();
      });
      expect(component.pageChange.emit).not.toHaveBeenCalled();
      expect(component.currentPageChange.emit).not.toHaveBeenCalled();
      expect(component.currentPage).toEqual(2);
    });
  });

  describe('isLastPage', () => {

    it('should return false if current page is not equal to totalNumPages', () => {
      component.totalNumPages = 5;
      component.currentPage = 3;
      expect(component.isLastPage()).toBeFalsy();
    });

    it('should return true if current page is equal to totalNumPages', () => {
      component.totalNumPages = 5;
      component.currentPage = 5;
      expect(component.isLastPage()).toBeTruthy();
    });
  });

  describe('isFirstPage', () => {

    it('should return false if current page is not equal to 1', () => {
      component.currentPage = 3;
      expect(component.isFirstPage()).toBeFalsy();
    });

    it('should return true if current page is equal to 1', () => {
      component.currentPage = 1;
      expect(component.isFirstPage()).toBeTruthy();
    });
  });

  describe('goToNextPage', () => {

    it('should not call goToPage if the current page is last page', () => {
      component.totalNumPages = 3;
      component.currentPage = 3;
      spyOn(component, 'goToPage').and.callThrough();

      component.goToNextPage();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
      });

      expect(component.goToPage).not.toHaveBeenCalled();
    });

    it('should call goToPage if the current page is not last page', () => {
      component.totalNumPages = 3;
      component.currentPage = 1;
      spyOn(component, 'goToPage').and.callThrough();

      component.goToNextPage();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
      });

      expect(component.goToPage).toHaveBeenCalledWith(2);
    });
  });

  describe('goToPrevPage', () => {

    it('should not call goToPage if the current page is 1', () => {
      component.totalNumPages = 5;
      component.currentPage = 1;
      spyOn(component, 'goToPage').and.callThrough();

      component.goToPrevPage();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
      });

      expect(component.goToPage).not.toHaveBeenCalled();
    });

    it('should call goToPage if the current page is not first page', () => {
      component.totalNumPages = 3;
      component.currentPage = 2;
      spyOn(component, 'goToPage').and.callThrough();

      component.goToPrevPage();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
      });

      expect(component.goToPage).toHaveBeenCalledWith(1);
    });
  });

  describe('onExcelExport', () => {

    it('should call excelExport event emitter', () => {
      spyOn(component.excelExport, 'next').and.callThrough();

      component.onExcelExport();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
      });

      expect(component.excelExport.next).toHaveBeenCalled();
    });
  });

  describe('onPrint', () => {

    it('should call onPrint event emitter', () => {
      spyOn(component.print, 'next').and.callThrough();

      component.onPrint();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
      });

      expect(component.print.next).toHaveBeenCalled();
    });
  });

  describe('onRefresh', () => {

    it('should call onRefresh event emitter', () => {
      spyOn(component.refresh, 'next').and.callThrough();

      component.onRefresh();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
      });

      expect(component.refresh.next).toHaveBeenCalled();
    });
  });

  describe('onMatchCaseChange', () => {

    it('should emit searchInput and searchInputSubmit', () => {
      spyOn(component.searchInput, 'next').and.callThrough();
      spyOn(component.searchInputSubmit, 'next').and.callThrough();
      spyOn(component, 'getEventData').and.callThrough();
      component.filterString = 'check';

      component.onMatchCaseChange();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
      });

      expect(component.searchInput.next).toHaveBeenCalled();
      expect(component.searchInputSubmit.next).toHaveBeenCalled();
      expect(component.getEventData).toHaveBeenCalled();
    });

    it('should not emit searchInput and searchInputSubmit if filterString is undefined', () => {
      spyOn(component.searchInput, 'next').and.callThrough();
      spyOn(component.searchInputSubmit, 'next').and.callThrough();
      spyOn(component, 'getEventData').and.callThrough();

      component.onMatchCaseChange();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
      });

      expect(component.searchInput.next).not.toHaveBeenCalled();
      expect(component.searchInputSubmit.next).not.toHaveBeenCalled();
      expect(component.getEventData).not.toHaveBeenCalled();
    });

  });

  describe('onClearInput', () => {

    it('should emit searchInput and searchInputSubmit', () => {
      spyOn(component.searchInput, 'next').and.callThrough();
      spyOn(component.searchInputSubmit, 'next').and.callThrough();
      spyOn(component, 'getEventData').and.callThrough();

      component.onClearInput();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
      });

      expect(component.filterString).toEqual('');
      expect(component.searchInput.next).toHaveBeenCalled();
      expect(component.searchInputSubmit.next).toHaveBeenCalled();
      expect(component.getEventData).toHaveBeenCalled();
    });

  });

  describe('onSearchInputSubmit', () => {

    it('should emit searchInputSubmit', () => {
      spyOn(component.searchInputSubmit, 'next').and.callThrough();
      spyOn(component, 'getEventData').and.callThrough();
      component.filterString = 'check';

      component.onSearchInputSubmit();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
      });

      expect(component.searchInputSubmit.next).toHaveBeenCalled();
      expect(component.getEventData).toHaveBeenCalled();
    });

    it('should not emit searchInputSubmit', () => {
      spyOn(component.searchInputSubmit, 'next').and.callThrough();
      spyOn(component, 'getEventData').and.callThrough();
      component.filterString = '';

      component.onSearchInputSubmit();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
      });

      expect(component.searchInputSubmit.next).not.toHaveBeenCalled();
      expect(component.getEventData).not.toHaveBeenCalled();
    });

  });

  describe('onPageChange', () => {

    it('should call goToPage with page number as e.target.value', () => {
      component.totalNumPages = 7;
      const e = {
        target: {value: 5}
      };
      spyOn(component, 'goToPage').and.callThrough();

      component.onPageChange(e);
      fixture.whenStable().then(() => {
        fixture.detectChanges();
      });

      expect(component.goToPage).toHaveBeenCalledWith(5);
    });

    it('should call goToPage with page number as totalNumPages', () => {
      component.totalNumPages = 7;
      const e = {
        target: {value: 8}
      };
      spyOn(component, 'goToPage').and.callThrough();

      component.onPageChange(e);
      fixture.whenStable().then(() => {
        fixture.detectChanges();
      });

      expect(component.goToPage).toHaveBeenCalledWith(7);
    });

    it('should call goToPage with page number as 1', () => {
      component.totalNumPages = 7;
      const e = {
        target: {value: 0}
      };
      spyOn(component, 'goToPage').and.callThrough();

      component.onPageChange(e);
      fixture.whenStable().then(() => {
        fixture.detectChanges();
      });

      expect(component.goToPage).toHaveBeenCalledWith(1);
    });

  });

});
