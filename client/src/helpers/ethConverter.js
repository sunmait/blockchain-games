export const mapEthToVei = (ethValue) => {
  return ethValue * (10 ** 18);
};

export const mapVeiToEth = (veiValue) => {
  return veiValue / (10 ** 18);
};