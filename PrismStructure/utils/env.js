const fs = require('fs');
const path = require('path');

const testDataPath = path.join(__dirname, '..', 'data', 'testData.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

const UI_BASE_URL = process.env.BASE_URL || 'https://practicesoftwaretesting.com';
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.practicesoftwaretesting.com';

function getDefaultUser() {
  return {
    email: process.env.USER_EMAIL || testData.defaultUser.email,
    password: process.env.USER_PASSWORD || testData.defaultUser.password,
  };
}

function getTestData() {
  return testData;
}

module.exports = {
  UI_BASE_URL,
  API_BASE_URL,
  getDefaultUser,
  getTestData,
};
