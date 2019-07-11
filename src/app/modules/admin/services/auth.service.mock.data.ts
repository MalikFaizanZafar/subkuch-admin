import { MemberResponse, Memeber, MemberDetails, MemberOverview } from "../models/vendor-members";

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
const MockUserDetails: MemberDetails[] = [
  {
    userId: 'user1@gmail.com',
    companyName: 'Dominos',
    companyLogo: 'https://s3-media1.fl.yelpcdn.com/bphoto/RWR_Y_UX2mQL5cHScptlqw/ls.jpg',
    companyRating: 4,
    companyImage: 'https://images.pexels.com/photos/941869/pexels-photo-941869.jpeg',
    overview: {
      welcomeParagraph: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut laudantium corporis cupiditate quaerat? Veritatis perspiciatis laudantium est repudiandae impedit ea, voluptate obcaecati vero id optio, iure ut, nulla voluptatibus molestiae',
      contact: {
        phone: ['+92-336-8361899', '+92-333-8361899'],
        email: 'dominos@gmail.com'
      },
      openingStatus: {
        start: '9:00 am',
        end: '11:00 pm'
      }
    }
  },
  {
    userId: 'user2@gmail.com',
    companyName: 'Pizza Hust',
    companyLogo: 'https://imgix.bustle.com/rehost/2016/9/13/b7509f98-4ff4-4644-90b7-1ffd61736804.png',
    companyRating: 4,
    companyImage: 'https://static.adweek.com/adweek.com-prod/wp-content/uploads/sites/8/2015/02/pizza-hut-logo.jpg',
    overview: {
      welcomeParagraph: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut laudantium corporis cupiditate quaerat? Veritatis perspiciatis laudantium est repudiandae impedit ea, voluptate obcaecati vero id optio, iure ut, nulla voluptatibus molestiae',
      contact: {
        phone: ['+92-336-8361899', '+92-333-8361899'],
        email: 'pizza_hut@gmail.com'
      },
      openingStatus: {
        start: '9:00 am',
        end: '11:00 pm'
      }
    }
  },
  {
    userId: 'user3@gmail.com',
    companyName: 'Dominos',
    companyLogo: 'https://nishatemporium.com/directory/images/kfc.png',
    companyRating: 4,
    companyImage: 'https://backgroundcheckall.com/wp-content/uploads/2017/12/background-of-kfc-9.jpg',
    overview: {
      welcomeParagraph: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut laudantium corporis cupiditate quaerat? Veritatis perspiciatis laudantium est repudiandae impedit ea, voluptate obcaecati vero id optio, iure ut, nulla voluptatibus molestiae',
      contact: {
        phone: ['+92-336-8361899', '+92-333-8361899'],
        email: 'dominos@gmail.com'
      },
      openingStatus: {
        start: '9:00 am',
        end: '11:00 pm'
      }
    }
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
export function getUserDetails( userId: string) {
  const userDetails = MockUserDetails.find(ud => ud.userId === userId)
  if(userDetails){
    return {
      statusCode: 200,
      statusMessage: 'success',
      data: userDetails
    }
  } else {
    return {
      statusCode: 201,
      statusMessage: `No Details found for the User with E-mail ${userId}`,
      data: userId
    }
  }
}

export function addUserOverview( id : string, overviewData : MemberOverview){
  const userDetails = MockUserDetails.find(ud => ud.userId === id)
  if(userDetails){
    userDetails.overview = overviewData
    return {
      statusCode: 200,
      statusMessage: 'success',
      data: `Overview Details of the user ${id} has been changed`
    }
  }else {
    return {
      statusCode: 201,
      statusMessage: `No Details found for the User with E-mail ${id}`,
      data: id
    }
  }
}