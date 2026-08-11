const { getTestData } = require('./env');

function uniqueEmail(prefix = 'qaauto') {
  const stamp = Date.now();
  const rand = Math.floor(Math.random() * 10000);
  return `${prefix}.${stamp}.${rand}@example.com`;
}

function uniquePassword() {
  const stamp = Date.now();
  const rand = Math.floor(Math.random() * 10000);
  return `QaPass!${stamp}${rand}X9`;
}

function registerPayload(email, password, overrides = {}) {
  const data = getTestData();
  const mail = email || uniqueEmail();
  return {
    ...data.apiRegister,
    email: mail,
    password: password || uniquePassword(),
    ...overrides,
  };
}

function invoicePayload(cartId) {
  const data = getTestData();
  return {
    ...data.apiInvoice,
    cart_id: cartId,
  };
}

function uniqueRegisterUser() {
  const stamp = Date.now();
  const rand = Math.floor(Math.random() * 10000);
  const { uiRegister } = getTestData();

  return {
    firstName: `Auto${rand}`,
    lastName: `Tester${stamp % 10000}`,
    email: uniqueEmail('uireg'),
    password: uniquePassword(),
    dob: uiRegister.dob,
    country: uiRegister.country,
    postalCode: uiRegister.postalCode,
    houseNumber: uiRegister.houseNumber,
    street: uiRegister.street,
    city: uiRegister.city,
    state: uiRegister.state,
    phone: uiRegister.phone,
  };
}

module.exports = {
  uniqueEmail,
  uniquePassword,
  uniqueRegisterUser,
  registerPayload,
  invoicePayload,
};
