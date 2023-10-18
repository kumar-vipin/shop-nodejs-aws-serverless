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

## Evaluation criteria

---
Reviewers should verify the lambda functions by invoking them through provided URLs.

- Product Service Serverless config contains configuration for 2 lambda functions, API is not working at all, but YAML configuration is correct
- The `getProductsList` OR `getProductsById` lambda function returns a correct response (POINT1)
- The `getProductsById` AND `getProductsList` lambda functions return a correct response code (POINT2)
- Your own Frontend application is integrated with Product Service (`/products` API) and products from Product Service are represented on Frontend. AND POINT1 and POINT2 are done.


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

## Evaluation criteria

---
Reviewers should verify the lambda functions by invoking them through provided URLs.

- Task 4.1 is implemented
- Task 4.2 is implemented lambda links are provided and returns data
- Task 4.3 is implemented lambda links are provided and products is stored in DB (call Task 4.2 to see the product)
- Your own Frontend application is integrated with Product Service (`/products` API) and products from Product Service are represented on Frontend. Link to a working Frontend application is provided for cross-check reviewer.

# Task 5 (Integration with S3)
<details>
  <summary>Task Focus</summary>
  The following image provides more info about task focus.
  <img src="./module5.png" />
</details>

### Task 5.1

1. Create a new service called `import-service` at the same level as Product Service with a its own `serverless.yml` file. The backend project structure should look like this:

```
   backend-repository
      product-service
      import-service
```

2. In the AWS Console **create** and **configure** a new S3 bucket with a folder called `uploaded`.

### Task 5.2

1. Create a lambda function called `importProductsFile` under the same Serverless config file (i.e. `serverless.yaml`) of the Import Service which will be triggered by the HTTP GET method.
2. The requested URL should be `/import`.
3. Implement its logic so it will be expecting a request with a name of CSV file with products and creating a new **Signed URL** with the following key: `uploaded/${fileName}`.
4. The name will be passed in a _query string_ as a `name` parameter and should be described in the `serverless.yml` file as a _request parameter_.
5. Update `serverless.yml` with policies to allow lambda functions to interact with S3.
6. The response from the lambda should be the created **Signed URL**.
7. The lambda endpoint should be integrated with the frontend by updating `import` property of the API paths configuration.

### Task 5.3

1. Create a lambda function called `importFileParser` under the same `serverless.yml` file which will be triggered by an S3 event.
2. The event should be `s3:ObjectCreated:*`
3. Configure the event to be fired only by changes in the `uploaded` folder in S3.
4. The lambda function should use a _readable stream_ to get an object from S3, parse it using `csv-parser` package and log each record to be shown in CloudWatch.


## Evaluation criteria

---
Reviewers should verify the lambda functions by invoking them through provided URLs.

- File `serverless.yml` contains configuration for `importProductsFile` function
- The `importProductsFile` lambda function returns a correct response which can be used to upload a file into the S3 bucket
- Frontend application is integrated with `importProductsFile` lambda
- The `importFileParser` lambda function is implemented and `serverless.yml` contains configuration for the lambda
