import { hello } from '../hello';

describe('hello Lambda Function', () => {
  it('should return a 200 status code and a message', async () => {

    const result = await hello({}); // Pass empty objects for context and callback

    expect(result.statusCode).toBe(200);
    expect(typeof result.body).toBe('string');

    if (result.body) {
      const responseBody = JSON.parse(result.body);
      expect(responseBody.message).toBe('Hello, Serverless with TypeScript!');
    }
  });
});
