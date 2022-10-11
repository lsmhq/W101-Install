function doubleClick(handle, time = 1000, n = 2) {
    let count = 0;
    let timer = false;
    console.log('dou')
    return function () {
      console.log('ble', count)

    };
  }


  export {
    doubleClick
  }