function isFloat(value) {
  const reg = /^(\d*)$|^(\d+\.?\d*)$/;
  return value.match(reg);
}
export default isFloat;