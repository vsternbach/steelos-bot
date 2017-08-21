function getCommentsCase(number) {
  number = number || 0;
  const root = 'комментари';
  let suffix;
  const rem = number % 10;
  switch (rem) {
    case 1:
      suffix = number % 100 === 11 ? 'ев' : 'й';
      break;
    case 2:
    case 3:
    case 4:
      suffix = 'я';
      break;
    case 0:
    default:
      suffix = 'ев';
      break;
  }
  return number + ' ' + root + suffix;
}

module.exports = {
  getCommentsCase
};