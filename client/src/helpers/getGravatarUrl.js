function getGravatarUrl(hash) {
  const address = window.web3.sha3(hash).slice(2);
  return `https://www.gravatar.com/avatar/${address}?d=robohash`;
}

export default getGravatarUrl;