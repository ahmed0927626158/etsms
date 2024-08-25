const crypto = require('crypto');

// Function to generate a random string of a specified length
const generateRandomString = (length) => {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
};

// Example usage to generate a random string of length 8
// const randomString = generateRandomString(8);
module.exports=generateRandomString