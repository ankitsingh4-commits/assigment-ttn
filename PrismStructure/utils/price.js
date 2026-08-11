function parsePrice(value) {
  if (!value) {
    return 0;
  }
  const normalized = String(value).replace(/[^0-9.]/g, '');
  return Number(normalized);
}

module.exports = { parsePrice };
