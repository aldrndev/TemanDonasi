const pointDonation = (type, total) => {
  if (type === "Pakaian") {
    return total * 10;
  } else if (type === "Elektronik") {
    return total * 100;
  } else if (type === "Alat Rumah Tangga") {
    return total * 25;
  } else if (type === "Aksesoris") {
    return total * 30;
  } else {
    return total * 15;
  }
};
module.exports = pointDonation;
