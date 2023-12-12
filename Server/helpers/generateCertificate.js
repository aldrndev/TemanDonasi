const generateCertificate = (phoneNumber) => {
  const date = Date.now();
  const number = phoneNumber.slice(5, 8);
  return `TMD-${date}-${number}`;
};

module.exports = generateCertificate;
