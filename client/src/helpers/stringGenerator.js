function generateString(len = 10){
  let generatedString = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < len; i++)
    generatedString += possible.charAt(Math.floor(Math.random() * possible.length));

  return generatedString;
}

export default generateString;