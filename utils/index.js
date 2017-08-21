function getCommentsCase(number) {
  const root = 'комментари';
  let suffix;
  const rem = number % 10;
  switch (rem) {
    case 1:
      suffix = 'й';
      break;
    case 2:
    case 3:
    case 4:
      suffix = 'я';
      break;
    default:
      suffix = 'ев';
      break;
  }
  return root + suffix;
}

module.exports = {
  getCommentsCase
};