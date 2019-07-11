import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { delay } from 'rxjs/operators';
import { getUserDetails, addUserOverview } from './auth.service.mock.data';
import { MemberDetailsResponse, MemberOverviewResponse, MemberOverview } from '../models/vendor-members';

/**
 * Mock service. It is meant to be deleted in production.
 */
export class UserDetailsService {
  getUserDetails(userId: string): Observable<MemberDetailsResponse> {
    return of(getUserDetails(userId)).pipe(delay(800));
  }

  addUserOverview(userId: string, overviewData : MemberOverview):Observable<MemberOverviewResponse>{
    return of(addUserOverview(userId, overviewData)).pipe(delay(800));
  }
}