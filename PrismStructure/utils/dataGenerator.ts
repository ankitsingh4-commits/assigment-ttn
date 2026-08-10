export function uniqueEmail(prefix = 'qaauto'): string {
  const stamp = Date.now();
  const rand = Math.floor(Math.random() * 10000);
  return `${prefix}.${stamp}.${rand}@example.com`;
}

export function registerPayload(email?: string) {
  const mail = email || uniqueEmail();
  return {
    first_name: 'QA',
    last_name: 'Automation',
    email: mail,
    password: 'Welcome01!',
    dob: '1990-05-15',
    phone: '5551234567',
    address: {
      street: 'Zoey Shore',
      city: 'Hesselbury',
      state: 'Florida',
      country: 'United States',
      postal_code: '1234AA',
    },
  };
}

export function invoicePayload(cartId: string) {
  return {
    billing_street: 'Zoey Shore',
    billing_city: 'Hesselbury',
    billing_state: 'Florida',
    billing_country: 'TG',
    billing_postal_code: '1234AA',
    payment_method: 'cash-on-delivery',
    cart_id: cartId,
    payment_details: {},
  };
}
