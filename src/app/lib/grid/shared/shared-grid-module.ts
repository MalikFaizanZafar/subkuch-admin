import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsGridColumnEditorTemplateLoader } from './column-editor-template-loader';
import { IsGridFooterColumnGroup } from './footer-column-group';
import { IsGridHeaderColumnGroup } from './header-column-group';
import { IsGridTemplateLoader } from './template-loader';
import { IsGridRow } from './row';
import { IsGridTemplate } from './template';
import { IsGridColumnFilterTemplateLoader } from './column-filter-template-loader';
import { IsGridColumnFooterTemplateLoader } from './column-footer-template-loader';
import { IsGridColumnBodyTemplateLoader } from './column-body-template-loader';
import { IsGridColumnHeaderTemplateLoader } from './column-header-template-loader';
import { IsGridTemplateWrapper } from './template-wrapper';
import { IsGridColumn } from './column';
import { IsGridFooter } from './footer';
import { IsGridHeader } from './header';


@NgModule({
  imports: [CommonModule],
  declarations: [
    IsGridHeader,
    IsGridFooter,
    IsGridColumn,
    IsGridTemplateWrapper,
    IsGridColumnHeaderTemplateLoader,
    IsGridColumnBodyTemplateLoader,
    IsGridColumnFooterTemplateLoader,
    IsGridColumnFilterTemplateLoader,
    IsGridTemplate,
    IsGridTemplateLoader,
    IsGridRow,
    IsGridHeaderColumnGroup,
    IsGridFooterColumnGroup,
    IsGridColumnEditorTemplateLoader
  ],
  exports: [
    IsGridHeader,
    IsGridFooter,
    IsGridColumn,
    IsGridTemplateWrapper,
    IsGridColumnHeaderTemplateLoader,
    IsGridColumnBodyTemplateLoader,
    IsGridColumnFooterTemplateLoader,
    IsGridColumnFilterTemplateLoader,
    IsGridTemplate,
    IsGridTemplateLoader,
    IsGridRow,
    IsGridHeaderColumnGroup,
    IsGridFooterColumnGroup,
    IsGridColumnEditorTemplateLoader
  ],
})
export class IsGridSharedModule { }
