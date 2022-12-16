let path = 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\'
const regedit = require('regedit');
regedit.list([path]).on('data', function (res) {
    console.log(res)
})