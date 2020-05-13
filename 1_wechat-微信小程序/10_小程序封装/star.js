//  封装评星数据
const LENGTH = 5;
const getStarsArr = stars => {
  let arr = [];
  stars = stars / 10;
  let ON = Math.floor(stars);
  let HALF = (stars % 1 === 0 ? false : true)

  for (let i = 0; i < ON; i++) {
    arr.push('ON')
  }
  if (HALF) {
    arr.push('HALF')
  }
  while (arr.length < LENGTH) {
    arr.push('OFF')
  }
  return arr
}