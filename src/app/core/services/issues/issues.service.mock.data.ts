// import * as batchConfig from '@app/core/config/batch';
// import { Branch } from '@app/core/models/branch';
// import { Repository } from '@app/core/models/repository';

// import { Batch } from '../../../modules/issues/models/batch';
// import { Issue } from '../../../modules/issues/models/issue';
// import { IssueColor } from '../../../modules/issues/models/issue-color';
// import { IssueType } from '../../../modules/issues/models/issue-type';
// import { Priority } from '../../../modules/issues/models/priority';

// export const repositories: Repository[] = generateRepositories();
// export const branches: Branch[] = generateBranches();
// export const types: IssueType[] = generateTypes();
// export let priorities: Priority[] = generatePriorities();
// export let batches: Batch[] = generateBatches();
// export let issues: Issue[] = []; // Starts empty. Will populate after the user logs off and logs back in again.
// export let issuesCompleted: Issue[] = generateIssues();

// export function prioritizeIssues(is: Issue[], id: number): void {
//   issues = issues.filter(v1 => !is.some(v2 => v2.id === v1.id));
//   let index: number = id < 4 ? issues.findIndex(v => v.priority && v.priority.id === id && !v.lock) : issues.length;

//   if (index === -1) {
//     index = issues.findIndex(v => !v.lock);
//   }

//   const priority: Priority | undefined = id < 4 ? priorities.find(v => v.id === id) : undefined;
//   issues = [...issues.slice(0, index), ...is.map(v => ({ ...v, priority })), ...issues.slice(index)];
//   issues = issues.map((v, i) => ({ ...v, order: i + 1, batch: undefined }));
//   priorities = priorities.map(i => ({ ...i, total: issues.filter(j => j.priority && j.priority.id === i.id).length }));
// }

// export function updateOrder(dropped: Issue, dragged: Issue, selected: Issue[]): void {
//   const first: number = issues[0].order;
//   issues = issues.filter(v1 => !selected.some(v2 => v2.id === v1.id));
//   const index: number = issues.findIndex(v => v.id === dropped.id);

//   // User is dragging downwards.
//   if (dropped.order > dragged.order) {
//     issues = [...issues.slice(0, index + selected.length), ...selected, ...issues.slice(index + selected.length)];
//     // User is dragging upwards.
//   } else {
//     let i: number = index - selected.length + 1;
//     i = i >= 0 ? i : 0;
//     issues = [...issues.slice(0, i), ...selected, ...issues.slice(i)];
//   }

//   // Update order and batch priorities.
//   issues = issues.map((v, i) => ({ ...v, order: i + first, batch: undefined }));

//   // Update batch position.
//   issues = issues.map(v =>
//     v.order % batchConfig.total === 0 ? { ...v, batch: this.batches[Math.floor(v.order / batchConfig.total - 1)] } : v,
//   );
// }

// export function populateIssues(): void {
//   issues = generateIssues(true);
// }

// function generateIssues(updatePriorities: boolean = false): Issue[] {
//   const result: Issue[] = [];
//   const amount: number = Math.round(Math.random() * 200 + 400);
//   const amounts: number[] = [Math.round(Math.random() * 100 + 100), Math.round(Math.random() * 100 + 100)];
//   amounts.push(amount - amounts[0] - amounts[1]);

//   if (updatePriorities) {
//     priorities = priorities.map((i, j) => ({ ...i, total: amounts[j] }));
//   }

//   for (let i: number = 0; i < amount; i++) {
//     const issuesType: IssueType = types[Math.round(Math.random() * (types.length - 1))];

//     result.push({
//       id: i + 1,
//       order: i + 1,
//       priority: getPriority(amounts, i),
//       repository: repositories[Math.round(Math.random() * (repositories.length - 1))],
//       branch: branches[Math.round(Math.random() * (branches.length - 1))],
//       type: issuesType,
//       loc: Math.round(Math.random() * 300 + 200),
//       duplicates: Math.round(Math.random() * 4 + 1),
//       blockSize: Math.round(Math.random() * 100 + 50),
//       completedOn: i <= 4 ? generateDate(i) : randomDate(new Date(2012, 0, 1), new Date()),
//       lock: i < batchConfig.total,
//       pullRequest: {
//         name: `fix-${i}: ${issuesType.label}`,
//         url: `https://github.com/angular/angular/pull/27888`,
//       },
//     });
//   }

//   return result;
// }

// function generateDate(value: number): Date {
//   const date: Date = new Date();
//   date.setDate(date.getDate() - value);
//   return date;
// }

// function randomDate(start: Date, end: Date): Date {
//   return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
// }

// function generateBatches(): Batch[] {
//   const result: Batch[] = [];
//   const amount: number = 10;
//   const today: Date = new Date();

//   for (let i: number = 1; i <= amount; i++) {
//     result.push({
//       id: i,
//       name: `Batch ${i}`,
//       date: new Date(today.getFullYear(), today.getMonth() + i - 1),
//     });
//   }

//   return result;
// }

// function generateTypes(): IssueType[] {
//   return [
//     { id: 1, label: 'Long Method', color: IssueColor.Green },
//     { id: 2, label: 'Duplicate Code', color: IssueColor.Blue },
//     { id: 3, label: 'Unclosed I/O Stream', color: IssueColor.Amber },
//   ];
// }

// function generateRepositories(): Repository[] {
//   const link: string =
//     'https://github.com/angular/angular/blob/master/modules/playground/src/order_management/index.ts#L21-L36';

//   return [
//     { id: 1, link, name: 'dfproto-codefix' },
//     { id: 2, link, name: 'aurea-kayako' },
//     { id: 3, link, name: 'ignite-infer-sales' },
//     { id: 4, link, name: 'aurea-lyris-hq-ui' },
//     { id: 5, link, name: 'is-peoplegraph' },
//     { id: 6, link, name: 'dfproto-frontend-library' },
//   ];
// }

// function generateBranches(): Branch[] {
//   return [
//     { id: 1, name: 'feature/ng-update-7.0' },
//     { id: 2, name: 'feature/new-auth-service' },
//     { id: 3, name: 'master' },
//     { id: 4, name: 'develop' },
//     { id: 5, name: 'test/improving-coverage' },
//   ];
// }

// function generatePriorities(): Priority[] {
//   return [
//     { id: 1, label: 'Priority 1', total: 0 },
//     { id: 2, label: 'Priority 2', total: 0 },
//     { id: 3, label: 'Priority 3', total: 0 },
//   ];
// }

// function getPriority(amounts: number[], index: number): Priority {
//   if (index < amounts[0]) {
//     return priorities[0];
//   } else if (index >= amounts[0] && index < amounts[0] + amounts[1]) {
//     return priorities[1];
//   } else {
//     return priorities[2];
//   }
// }
