// import * as config from '@app/core/config/issues';
// import { Page } from '@app/core/models/page';
// import { Observable } from 'rxjs/internal/Observable';
// import { of } from 'rxjs/internal/observable/of';
// import { delay } from 'rxjs/operators';

// import { Repository } from '../../models/repository';
// import * as mock from './repos-list.service.mock.data';

// /**
//  * Mock service. It is meant to be deleted in production.
//  */
// export class ReposServiceMock {
//   getRepositories(
//     page: number = config.page,
//     size: number = config.size,
//     filter?: string,
//   ): Observable<Page<Repository>> {
//     let data: Repository[] = mock.repositories;
//     data = filter ? this.filteredRepos(data, filter) : data;

//     return of({
//       page,
//       size,
//       total: data.length,
//       data: data.slice((page - 1) * size, (page - 1) * size + size),
//     }).pipe(delay(800));
//   }

//   getGitHubRepositories(
//     page: number = config.page,
//     size: number = config.size,
//     filter?: string,
//   ): Observable<Page<Repository>> {
//     let data: Repository[] = mock.gitHubRepositories.filter(item => !item.selected);
//     data = filter ? this.filteredRepos(data, filter) : data;

//     return of({
//       page,
//       size,
//       total: data.length,
//       data: data.slice((page - 1) * size, (page - 1) * size + size),
//     }).pipe(delay(800));
//   }

//   getGitHubRepositoriesTotal(): Observable<number> {
//     return of(mock.gitHubRepositories.length).pipe(delay(800));
//   }

//   addAllGitHubRepositories(): Observable<null> {
//     mock.addAllGitHubRepositories();
//     return of(null).pipe(delay(800));
//   }

//   addGitHubRepositories(repositories: Repository[]): Observable<null> {
//     mock.addGitHubRepositories(repositories);
//     return of(null).pipe(delay(800));
//   }

//   activateRepository(_repository: Repository): Observable<null> {
//     return of(null).pipe(delay(800));
//   }

//   deactivateRepository(_repository: Repository): Observable<null> {
//     return of(null).pipe(delay(800));
//   }

//   changeBranch(_repository: Repository): Observable<null> {
//     return of(null).pipe(delay(800));
//   }

//   private filteredRepos(data: Repository[], filter: string): Repository[] {
//     return data.filter(item => {
//       if (item.name.indexOf(filter) > -1) {
//         return item;
//       }
//     });
//   }
// }
