export const hello = async (event) => {
  // Your function logic here
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello, Serverless with TypeScript!' }),
  };
};
