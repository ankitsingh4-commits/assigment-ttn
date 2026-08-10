export const UI_BASE_URL =
  process.env.BASE_URL || 'https://practicesoftwaretesting.com';

export const API_BASE_URL =
  process.env.API_BASE_URL || 'https://api.practicesoftwaretesting.com';

export const DEFAULT_USER = {
  email: process.env.USER_EMAIL || 'customer2@practicesoftwaretesting.com',
  password: process.env.USER_PASSWORD || 'welcome01',
};
