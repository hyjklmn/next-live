function platFormNameConvert(platFormName: string) {
  switch (platFormName) {
    case "douyu":
      return "斗鱼"
    case "huya":
      return "虎牙"
    case "bilibili":
      return "哔哩哔哩"
    default:
      return '未定义'
  }
}

function onlineConvert(number: string | number) {
  let num = number.toString().trim()
  if (num.length > 4) {
    let numCut = num.substring(0, num.length - 4)
    let afterPoint = num.substring(num.length - 4, num.length - 3)
    return numCut + '.' + afterPoint + '万'
  } else {
    return num + '人'
  }
}
export { platFormNameConvert, onlineConvert }
