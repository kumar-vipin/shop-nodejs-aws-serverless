const UUID = {
  generateUUID() {
    // Get the current timestamp in milliseconds
    const timestamp = Date.now().toString(36);

    // Generate a random 8-character string (using base 36)
    const randomString = Math.random().toString(36).substr(2, 8);

    // Concatenate the timestamp and random string to create the unique identifier
    return (timestamp + randomString);
  },
};

export { UUID };
