import { MemberResponse, Memeber } from "../models/vendor-members";

const MockUser: Memeber[] = [
  {
    username: 'user1@gmail.com',
    password: 'p@ssword1',
    isActive: true,
    isEmailVerified: true
  }, {
    username: 'user2@gmail.com',
    password: 'p@ssword1',
    isActive: false,
    isEmailVerified: true
  }, {
    username: 'user3@gmail.com',
    password: 'p@ssword1',
    isActive: true,
    isEmailVerified: false
  }
]

/**
 * Mock data. It is meant to be deleted in production.
 */
export function getUser (username: string, password: string): MemberResponse {
  const data = MockUser.find(item => item.username === username && item.password === password);
  if (data) {
    return {
      statusCode: 200,
      statusMessage: 'success',
      data: data
    }
  } else {
    return {
      statusCode: 201,
      statusMessage: 'Username or Password is Incorrect',
      data: {
        username: username,
        password: password
      }
    }
  }
} 
