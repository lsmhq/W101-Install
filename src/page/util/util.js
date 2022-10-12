
// 防抖
// 频繁触发只触发最后一次操作
function debounce(fn, delay) {
  let timeout = null;
  return function (event) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
          fn.apply(this, arguments);
      }, delay);
  };
}
// 节流
// 多次触发的情况下减少触发的次数
function throttle(fn, delay) {
  let valid = true
  return function (e) {
      if (!valid) {
          return false
      }
      valid = false
      setTimeout(() => {
          fn(e)
          valid = true;
      }, delay)
  }
}

function formatSeconds(value) {
  var theTime = parseInt(value);// 秒
  var theTime1 = 0;// 分
  var theTime2 = 0;// 小时
  if (theTime > 60) {
      theTime1 = parseInt(theTime / 60);
      theTime = parseInt(theTime % 60);
      if (theTime1 > 60) {
          theTime2 = parseInt(theTime1 / 60);
          theTime1 = parseInt(theTime1 % 60);
      }
  }
  var result = "" + parseInt(theTime);
  if(result < 10){
      result = '0' + result;
  }
  if (theTime1 > 0) {
      result = "" + parseInt(theTime1) + ":" + result;
      if(theTime1 < 10){
          result = '0' + result;
      }
  }else{
      result = '00:' + result;
  }
  if (theTime2 > 0) {
      result = "" + parseInt(theTime2) + ":" + result;
      if(theTime2 < 10){
          result = '0' + result;
      }
  }else{
      result = '00:' + result;
  }
  let res = result.split(':')
  let hour = res[0]
  let min = res[1]
  let sec = res[2]
  result = `${hour==='00' ? '': hour + ':'}${min}:${sec}`
  return result;
}


function formatSecondsV2(value) {
  var theTime = parseInt(value);// 秒
  var theTime1 = 0;// 分
  var theTime2 = 0;// 小时
  if (theTime > 60) {
      theTime1 = parseInt(theTime / 60);
      theTime = parseInt(theTime % 60);
      if (theTime1 > 60) {
          theTime2 = parseInt(theTime1 / 60);
          theTime1 = parseInt(theTime1 % 60);
      }
  }
  var result = "" + parseInt(theTime);
  if(result < 10){
      result = '0' + result;
  }
  if (theTime1 > 0) {
      result = "" + parseInt(theTime1) + ":" + result;
      if(theTime1 < 10){
          result = '0' + result;
      }
  }else{
      result = '00:' + result;
  }
  if (theTime2 > 0) {
      result = "" + parseInt(theTime2) + ":" + result;
      if(theTime2 < 10){
          result = '0' + result;
      }
  }else{
      result = '00:' + result;
  }
  let res = result.split(':')
  let hour = res[0]
  let min = res[1]
  let sec = res[2]
  let secc = (''+value).split('.')[1]
  result = `${hour==='00' ? '': hour + ':'}${min}:${sec}.${secc}`
  return result;
}
export {
  debounce,
  throttle,
  formatSeconds,
  formatSecondsV2
}