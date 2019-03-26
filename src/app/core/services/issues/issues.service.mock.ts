// import { Observable } from 'rxjs/internal/Observable';
// import { forkJoin } from 'rxjs/internal/observable/forkJoin';
// import { of } from 'rxjs/internal/observable/of';
// import { delay } from 'rxjs/operators';

// import * as issuesConfig from '@app/core/config/issues';
// import * as batchConfig from '@app/core/config/batch';

// import { Branch } from '@app/core/models/branch';
// import { Page } from '@app/core/models/page';

// import { Range } from '../../../modules/issues/components/column-filter/models/range';
// import { ColumnName } from '../../../modules/issues/models/column-name';
// import { Filter } from '../../../modules/issues/models/filter';
// import { FilterValue } from '../../../modules/issues/models/filter-value';
// import { Issue } from '../../../modules/issues/models/issue';
// import { IssueType } from '../../../modules/issues/models/issue-type';
// import { Priority } from '../../../modules/issues/models/priority';
// import * as mock from './issues.service.mock.data';
// import { Batch } from '../../../modules/issues/models/batch';

// export class IssuesServiceMock {
//   getIssues(
//     page: number = issuesConfig.page,
//     size: number = issuesConfig.size,
//     filters: Filter[] = [{ property: ColumnName.Priority, values: [1] }], // Priority 1 selected by default.
//   ): Observable<Page<Issue>> {
//     const data: Issue[] = this.filterIssues(filters, this.updateBatchInformation(mock.issues));

//     return of({
//       page,
//       size,
//       total: data.length,
//       data: data,
//     }).pipe(delay(800));
//   }

//   getCompletedIssues(page: number = issuesConfig.page, size: number = issuesConfig.size): Observable<Page<Issue>> {
//     return of({
//       page,
//       size,
//       total: mock.issuesCompleted.length,
//       data: mock.issuesCompleted,
//     }).pipe(delay(800));
//   }

//   getIssuesTotal(): Observable<number> {
//     return of(mock.issues.length).pipe(delay(800));
//   }

//   getCompletedIssuesTotal(): Observable<number> {
//     return of(mock.issuesCompleted.length).pipe(delay(800));
//   }

//   getPriorities(): Observable<Priority[]> {
//     return of(mock.priorities).pipe(delay(800));
//   }

//   getTypes(): Observable<IssueType[]> {
//     return of(mock.types).pipe(delay(800));
//   }

//   getBranches(): Observable<Branch[]> {
//     return of(mock.branches).pipe(delay(800));
//   }

//   getBatches(): Observable<Batch[]> {
//     return of(mock.batches).pipe(delay(800));
//   }

//   prioritizeIssues(
//     issues: Issue[],
//     priority: number,
//     page?: number,
//     size?: number,
//     filters?: Filter[],
//   ): Observable<[Page<Issue>, Priority[]]> {
//     mock.prioritizeIssues(issues, priority);
//     return forkJoin(this.getIssues(page, size, filters), of(mock.priorities));
//   }

//   updateOrder(dropped: Issue, dragged: Issue, selected: Issue[]): Observable<null> {
//     mock.updateOrder(dropped, dragged, selected);
//     return of(null).pipe(delay(800));
//   }

//   populateIssues(): void {
//     mock.populateIssues();
//   }

//   private filterIssues(filters: Filter[] = [], issues: Issue[]): Issue[] {
//     if (!filters.length) {
//       return this.updateBatchInformation(issues);
//     }

//     let result: Issue[] = issues;

//     for (let i: number = 0; i < filters.length; i++) {
//       const { property, values } = filters[i];

//       switch (property) {
//         case ColumnName.Priority:
//           result = result.filter(j => (<FilterValue[]>values).some(k => j.priority && k === j.priority.id));
//           break;
//         case ColumnName.Type:
//           result = result.filter(j => (<FilterValue[]>values).some(k => j.type && k === j.type.id));
//           break;
//         case ColumnName.Repository:
//           result = result.filter(j => (<FilterValue[]>values).some(k => j.repository && k === j.repository.id));
//           break;
//         case ColumnName.Branch:
//           result = result.filter(j => (<FilterValue[]>values).some(k => j.branch && k === j.branch.id));
//           break;
//         case ColumnName.Loc: {
//           const from: number = (<Range>values).from;
//           const to: number = (<Range>values).to;

//           if (from) {
//             result = result.filter(j => j.loc >= from);
//           }

//           if (to) {
//             result = result.filter(j => j.loc <= to);
//           }

//           break;
//         }
//         case ColumnName.Duplicates: {
//           const from: number = (<Range>values).from;
//           const to: number = (<Range>values).to;

//           if (from) {
//             result = result.filter(j => j.duplicates >= from);
//           }

//           if (to) {
//             result = result.filter(j => j.duplicates <= to);
//           }

//           break;
//         }
//         case ColumnName.BlockSize: {
//           const from: number = (<Range>values).from;
//           const to: number = (<Range>values).to;

//           if (from) {
//             result = result.filter(j => j.blockSize >= from);
//           }

//           if (to) {
//             result = result.filter(j => j.blockSize <= to);
//           }

//           break;
//         }
//         default:
//           return;
//       }
//     }

//     return this.updateBatchInformation(result);
//   }

//   private updateBatchInformation(issues: Issue[]): Issue[] {
//     issues = issues.map(v =>
//       v.order % batchConfig.total === 0
//         ? { ...v, batch: mock.batches[Math.floor(v.order / batchConfig.total - 1)] }
//         : v,
//     );

//     return issues;
//   }
// }
