const faker = require("faker");
faker.locale = "es";

const createProducts = () => ({
  title: faker.commerce.productName(),
  price: faker.commerce.price(100, 7000, 2, "$"),
  imageURL: faker.image.avatar(),
});

class MockApi {
  constructor(resource) {
    this.resource = resource;
  }

  populate(qty = 50) {
    const mockedItems = [];
    for (let i = 1; i <= qty; i++) {
      const newItem = this.createItem(this.resource);

      mockedItems.push(newItem);
    }
    return mockedItems;
  }

  createItem(resource) {
    const newItems = {
      producto: createProducts(),
    };
    return newItems[resource];
  }
}

module.exports = MockApi;
