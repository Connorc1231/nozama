const faker = require('faker');

const generatePassword = () => (
  faker.random.alphaNumeric() +
  faker.random.alphaNumeric() +
  faker.random.alphaNumeric() +
  faker.random.alphaNumeric() +
  faker.random.alphaNumeric() +
  faker.random.alphaNumeric()
);

const getFakeUser = () => {
  const username = faker.name.firstName() +
    faker.name.lastName() +
    Math.floor(Math.random() * 99) +
    Math.floor(Math.random() * 99);

  userData = {
    id: null,
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    username: username,
    password: generatePassword(),
    age: Math.floor(Math.random() * 90),
    gender: ['M', 'F'][Math.floor(Math.random() * 2)],
    state: faker.address.stateAbbr(),
    orders: [{
      product_id: Math.floor(Math.random() * 10000),
      order_placed_at: (Math.floor(Math.random() * 11) + 1) + '/' + Math.floor(Math.random() * 30) + '/' + (Math.floor(Math.random() * 18) + 2000),
      price: Math.floor(Math.random() * 1000),
    },
    {
      product_id: Math.floor(Math.random() * 10000),
      order_placed_at: (Math.floor(Math.random() * 11) + 1) + '/' + Math.floor(Math.random() * 30) + '/' + (Math.floor(Math.random() * 18) + 2000),
      price: Math.floor(Math.random() * 1000),
    },
    ],
    wishlist: [{
      product_id: Math.floor(Math.random() * 10000),
      created_at: (Math.floor(Math.random() * 11) + 1) + '/' + Math.floor(Math.random() * 30) + '/' + (Math.floor(Math.random() * 18) + 2000),
      price: Math.floor(Math.random() * 1000),
    },
    {
      product_id: Math.floor(Math.random() * 10000),
      created_at: (Math.floor(Math.random() * 11) + 1) + '/' + Math.floor(Math.random() * 30) + '/' + (Math.floor(Math.random() * 18) + 2000),
      price: Math.floor(Math.random() * 1000),
    },
    ],
  };
  return userData;
};

module.exports = getFakeUser;

