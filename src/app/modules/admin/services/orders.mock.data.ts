import { order } from "../models/vendor-members";

const orders : order[] = [
  {
    oNum: 1,
    user: 'malikfaizanzafar',
    dateTime: {
      date: '6/2/2019',
      time: '17:30'
    },
    items: [
      {
        name: 'Burger',
        quantity: 2
      },
      {
        name: 'Pizzas',
        quantity: 1
      },{
        name: 'Drinks',
        quantity: 2
      }
    ],
    status: 'New' 
  },
  {
    oNum: 2,
    user: 'hassan.touqeer',
    dateTime: {
      date: '6/3/2019',
      time: '20:30'
    },
    items: [
      {
        name: 'Burger',
        quantity: 5
      },
      {
        name: 'Pizzas',
        quantity: 2
      },{
        name: 'Drinks',
        quantity: 5
      }
    ],
    status: 'Completed' 
  },
  {
    oNum: 3,
    user: 'Osama',
    dateTime: {
      date: '6/2/2019',
      time: '17:30'
    },
    items: [
      {
        name: 'Burger',
        quantity: 2
      },
      {
        name: 'Pizzas',
        quantity: 1
      },{
        name: 'Drinks',
        quantity: 2
      }
    ],
    status: 'Working' 
  },
  {
    oNum: 4,
    user: 'Userfour',
    dateTime: {
      date: '10/2/2019',
      time: '23:30'
    },
    items: [
      {
        name: 'Burger',
        quantity: 2
      },
      {
        name: 'Pizzas',
        quantity: 1
      },{
        name: 'Drinks',
        quantity: 2
      }
    ],
    status: 'Delivered' 
  },
  {
    oNum: 5,
    user: 'userfive',
    dateTime: {
      date: '6/2/2019',
      time: '18:30'
    },
    items: [
      {
        name: 'Burger',
        quantity: 2
      },
      {
        name: 'Pizzas',
        quantity: 1
      },{
        name: 'Drinks',
        quantity: 2
      }
    ],
    status: 'New' 
  },
  {
    oNum: 6,
    user: 'usersix',
    dateTime: {
      date: '11/2/2019',
      time: '15:30'
    },
    items: [
      {
        name: 'Burger',
        quantity: 2
      },
      {
        name: 'Pizzas',
        quantity: 1
      },{
        name: 'Drinks',
        quantity: 2
      }
    ],
    status: 'New' 
  },
  {
    oNum: 7,
    user: 'userseven',
    dateTime: {
      date: '16/2/2019',
      time: '17:30'
    },
    items: [
      {
        name: 'Burger',
        quantity: 2
      },
      {
        name: 'Pizzas',
        quantity: 1
      },{
        name: 'Drinks',
        quantity: 2
      }
    ],
    status: 'New' 
  }
]

export function getOrders(){
  return orders
}