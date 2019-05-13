// import { Branch } from '../../models/branch';
// import { Repository } from '../../models/repository';

// const branches: string[] = ['master', 'develop', 'env/staging', 'env/prod', 'env/qa'];

// const gitHubRepositoryNames: string[] = [
//   'trilogy-group/aurea-cxprocess-main',
//   'trilogy-group/ignite-sensage-automation-ui',
//   'trilogy-group/aurea-cxm-users-pca',
//   'trilogy-group/aurea-kayako',
//   'trilogy-group/aurea-lyris-hq-ui',
//   'trilogy-group/jive-cloud-application',
//   'trilogy-group/jive-cloud-application',
//   'trilogy-group/devfactory-devspaces',
//   'trilogy-group/firm58-dev',
//   'trilogy-group/aurea-cxmonitor',
//   'trilogy-group/ignite-nuview-hrms',
//   'trilogy-group/aurea-crm-net',
//   'trilogy-group/aurea-cxmonitor-test-automation',
//   'trilogy-group/is-peoplegraph',
//   'trilogy-group/aurea-eng-docker-gfi-lyris-hq',
//   'trilogy-group/aurea-ace-gce',
//   'trilogy-group/bootcamp-firstrain-system',
//   'trilogy-group/jive-hop-custom',
//   'trilogy-group/aurea-crm-connectors',
//   'trilogy-group/firm58-skynet',
//   'trilogy-group/kayako-app-widget',
//   'crossover/ws-pro-report',
//   'crossover/crossover-xo.clients-javatracker',
//   'crossover/aurea-crm-pad',
//   'crossover/ignite-acorn-pa5g',
//   'crossover/jive-cdm-dc-cloud',
//   'crossover/kayako-test-automation-suite-tnk',
//   'crossover/kayako-SWIFT',
//   'crossover/ignite-acorn-aaa',
//   'crossover/dfproto-codefix',
//   'crossover/ignite-sensage-analyzer',
//   'devfactory/aline',
//   'devfactory/swing',
//   'devfactory/dev-rank',
//   'devfactory/mobilogy',
//   'devfactory/one-scm',
//   'devfactory/chute',
//   'devfactory/placeable',
//   'devfactory/bandcamp',
//   'devfactory/easier',
//   'devfactory/components-library',
// ];

// export let repositories: Repository[] = [];
// export const gitHubRepositories: Repository[] = generateGitHubRepositories();

// export function addAllGitHubRepositories(): void {
//   repositories = JSON.parse(JSON.stringify(gitHubRepositories));
// }

// export function addGitHubRepositories(rs: Repository[]): void {
//   repositories = JSON.parse(JSON.stringify(rs));
// }

// function generateGitHubRepositories(): Repository[] {
//   const rs: Repository[] = [];
//   const branchList: Branch[] = generateMockedBranches();

//   for (let i: number = 0; i < 1000; i++) {
//     rs.push({
//       id: i + 1,
//       name: gitHubRepositoryNames[Math.round(Math.random() * (gitHubRepositoryNames.length - 1))],
//       active: false,
//       branches: generateMockedBranches(),
//       commitDate: i <= 4 ? generateDate(i) : randomDate(new Date(2012, 0, 1), new Date()),
//       idSelectedBranch: branchList.filter(j => j.name === 'master' || j.name === 'develop')[
//         Math.round(Math.random() * 1)
//       ].id,
//     });
//   }

//   return rs;
// }

// function randomDate(start: Date, end: Date): Date {
//   return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
// }

// function generateDate(value: number): Date {
//   const date: Date = new Date();
//   date.setDate(date.getDate() - value);
//   return date;
// }

// function generateMockedBranches(): Branch[] {
//   const result: Branch[] = [];

//   for (let i: number = 0; i < branches.length; i++) {
//     result.push({
//       id: i + 1,
//       name: branches[i],
//       revision: 'rev123',
//       updateOn: new Date(),
//     });
//   }

//   return result;
// }
