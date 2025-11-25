export const formatPrice = function (amountInCents, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amountInCents / 100);
};

export const formatDate = dateString =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatExpiryDate = value => {
  return value
    .replace(/\D/g, '')
    .replace(/(.{2})(.{2})/, '$1/$2')
    .substring(0, 5);
};

export const formatCardNumber = value => {
  return value
    .replace(/\s/g, '')
    .replace(/(.{4})/g, '$1 ')
    .trim();
};
