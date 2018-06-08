function getEthPrice() {
  return new Promise((resolve) => {
    fetch('https://api.coinmarketcap.com/v2/ticker/1/?convert=ETH')
      .then(response => response.json())
      .then(response => {
        const BTCPrice = response.data.quotes.USD.price;
        const ETHRatio = response.data.quotes.ETH.price;
        const ETHPrice = BTCPrice / ETHRatio;
        resolve(ETHPrice);
      });
  });
}

export default getEthPrice;