const { getTestData } = require('./env');

function uniqueEmail(prefix = 'qaauto') {
  const stamp = Date.now();
  const rand = Math.floor(Math.random() * 10000);
  return `${prefix}.${stamp}.${rand}@example.com`;
}

function registerPayload(email) {
  const data = getTestData();
  const mail = email || uniqueEmail();
  return {
    ...data.apiRegister,
    email: mail,
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
  const { registerUser } = getTestData();

  return {
    firstName: `Auto${rand}`,
    lastName: `Tester${stamp % 10000}`,
    email: uniqueEmail('uireg'),
    password: registerUser.password,
  };
}

module.exports = {
  uniqueEmail,
  uniqueRegisterUser,
  registerPayload,
  invoicePayload,
};
