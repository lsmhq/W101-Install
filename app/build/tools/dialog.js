let dialogElement = document.getElementsByClassName('live2d-widget-dialog')[0]
let closeTimer
function displayDialog() {
  dialogElement.style.opacity = 1;
}

function hiddenDialog() {
  dialogElement.style.opacity = 0;
}

function alertText(text) {
  displayDialog();
  dialogElement.innerText = text;
  clearTimeout(closeTimer);
  closeTimer = setTimeout(function () {
    hiddenDialog();
  }, 5000);
}
window.alertText = alertText
module.exports = {
  displayDialog, hiddenDialog, alertText
};