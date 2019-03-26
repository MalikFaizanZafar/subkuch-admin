import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { delay } from 'rxjs/operators';
import { getUser } from './auth.service.mock.data';
import { MemberResponse } from '../models/vendor-members';

/**
 * Mock service. It is meant to be deleted in production.
 */
export class AuthServiceMock {
  getUserLoggedIn(username: string, password: string): Observable<MemberResponse> {
    return of(getUser(username, password)).pipe(delay(800));
  }
}
