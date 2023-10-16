## Architecture
Find the entire program architecture: [here](readme-resource/Architecture.pdf).

# Task 3 (First API with AWS API Gateway and AWS Lambda)
<details>
  <summary>Task Focus</summary>
   The following image provides more info about task focus.
  <img src="readme-resource/module3.png" />
</details>

### Task 3.1

1. Create a lambda function called `getProductsList` under the same Serverless config file (i.e. `serverless.yaml`) of Product Service which will be triggered by the HTTP GET method.
2. The requested URL should be `/products`.
3. The response from the lambda should be a _full_ array of products (mock data should be used - this mock data should be stored in Product Service).
4. This endpoint should be integrated with Frontend app for _PLP_ (Product List Page) representation.

### Task 3.2

1. Create a lambda function called `getProductsById` under the same Serverless config file (i.e. `serverless.yaml`) of Product Service which will be triggered by the HTTP GET method.
2. The requested URL should be `/products/{productId}` (what `productId` is in your application is up to you - productName, UUID, etc.).
3. The response from the lambda should be 1 searched product from an array of products (mock data should be used - this mock data should be stored in Product Service).
4. This endpoint is not needed to be integrated with Frontend right now.


# Task 4 (Integration with NoSQL Database)
<details>
  <summary>Task Focus</summary>
   The following image provides more info about task focus.
  <img src="readme-resource/module4.png" />
</details>
### Task 4.1

1. Use AWS Console to create two database tables in DynamoDB. Expected schemas for products and stocks:

Product model:

```
  products:
    id -  uuid (Primary key)
    title - text, not null
    description - text
    price - integer
```

Stock model:

```
  stocks:
    product_id - uuid (Foreign key from products.id)
    count - integer (Total number of products in stock, can't be exceeded)
```

2. Write a script to fill tables with test examples. Store it in your Github repository. Execute it for your DB to fill data.

### Task 4.2

1. Extend your `serverless.yml` file with data about your database table and pass it to lambda’s environment variables section.
2. Integrate the `getProductsList` lambda to return via GET `/products` request a list of products from the database (joined stocks and products tables).
3. Implement a Product model on FE side as a joined model of product and stock by `productId`. For example:

_BE: Separate tables in DynamoDB_

```
  Stock model example in DB:
  {
    product_id: '19ba3d6a-f8ed-491b-a192-0a33b71b38c4',
    count: 2
  }


  Product model example in DB:
  {
    id: '19ba3d6a-f8ed-491b-a192-0a33b71b38c4'
    title: 'Product Title',
    description: 'This product ...',
    price: 200
  }
```

_FE: One product model as a result of BE models join (product and it's stock)_

```
  Product model example on Frontend side:
  {
    id: '19ba3d6a-f8ed-491b-a192-0a33b71b38c4',
    count: 2
    price: 200,
    title: ‘Product Title’,
    description: ‘This product ...’
  }
```

_NOTE: This setup means User cannot buy more than `product.count` (no more items in stock) - but this is future functionality on FE side._

4. Integrate the `getProductsById` lambda to return via GET `/products/{productId}` request a single product from the database.

### Task 4.3

1. Create a lambda function called `createProduct` under the same Serverless config file (i.e. `serverless.yaml`) of Product Service which will be triggered by the HTTP POST method.
2. The requested URL should be `/products`.
3. Implement its logic so it will be creating a new item in a Products table.
4. Save the URL (API Gateway URL) to execute the implemented lambda functions for later - you'll need to provide it in the PR (e.g in PR's description) when submitting the task.
