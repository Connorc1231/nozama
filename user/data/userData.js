const faker = require('faker');

const generatePassword = () => {
  return (
    faker.random.alphaNumeric() + 
    faker.random.alphaNumeric() + 
    faker.random.alphaNumeric() + 
    faker.random.alphaNumeric() +
    faker.random.alphaNumeric() +
    faker.random.alphaNumeric() 
    );
}

const getFakeUser = () => {
  userData = {
    "id": null,
    "first-name": faker.name.firstName(),
    "last-name": faker.name.lastName(),
    "email": faker.internet.email(),
    "username": faker.lorem.word(),
    "password": generatePassword(),
    "age": Math.floor(Math.random() * 90) + 13,
    "gender": ['M', 'F'][Math.floor(Math.random() * 2)],
    "zip": faker.address.zipCode(),
    "state": faker.address.stateAbbr(),
    "location": {
      "lat": faker.address.latitude(),
      "lon": faker.address.longitude()
    },
    "subscription": "T",
    "social-media": {
      "facebook_url": "https://facebook.com",
      "twitter_url": "https://twitter.com",
      "instagram_url": "https://instagram.com"
    },
    "orders": [
    {
      "productId": 1,
      "order_placed_at": "2017-05-23",
      "price": 19.99
    },
    {
      "productId": 3,
      "order_placed_at": "2017-05-25",
      "price": 299.99
    }
    ],
    "wishlist": [
    {
      "productId": 2,
      "created_at": "2018-01-13",
      "price": 0.99
    },
    {
      "productId": 4,
      "created_at": "2017-12-13",
      "price": 99.99
    }
    ],
    "cart": [
    {
      "productId": 5,
      "created_at": "2016-04-20",
      "price": 59.99
    },
    {
      "productId": 69,
      "created_at": "2018-01-02",
      "price": 1.99
    }
    ]
  }
  return userData
};

module.exports = getFakeUser;

// {
//   "id": 1,
//   "firstName": "Jimmy",
//   "lastName": "Bobby",
//   "email": "cbobby@gmail.com",
//   "username": "rusSs1222",
//   "password": "mypass",
//   "age": 20,
//   "gender": "M",
//   "zip": 95070,
//   "state": "CA",
//   "location": {
//     "lat": 69,
//     "lon": 420
//   },
//   "subscription": "T",
//   "socialMedia": {
//     "facebook_url": "https://facebook.com",
//     "twitter_url": "https://twitter.com",
//     "instagram_url": "https://instagram.com"
//   },
//   "orders": [
//     {
//       "productId": 1,
//       "orderPlacedAt": "2017-05-23",
//       "price": 19.99
//     },
//     {
//       "productId": 3,
//       "orderPlacedAt": "2017-05-25",
//       "price": 299.99
//     }
//   ],
//   "wishlist": [
//     {
//       "productId": 2,
//       "createdAt": "2018-01-13",
//       "price": 0.99
//     },
//     {
//       "productId": 4,
//       "createdAt": "2017-12-13",
//       "price": 99.99
//     }
//   ],
//   "cart": [
//     {
//       "productId": 5,
//       "createdAt": "2016-04-20",
//       "price": 59.99
//     },
//     {
//       "productId": 69,
//       "createdAt": "2018-01-02",
//       "price": 1.99
//     }
//   ]
// }