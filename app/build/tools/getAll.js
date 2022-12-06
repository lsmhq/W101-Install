let path = 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\'
const regedit = require('regedit');
regedit.list([path]).on('data', function (res) {
    // console.log(res)
})
let interfaces = require('os').networkInterfaces();
console.log(interfaces)
// function getIpAddress(){
//     let ip
//     for (let devName in interfaces) {
//         let iface = interfaces[devName];
//         for (let i = 0; i < iface.length; i++) {
//             let alias = iface[i];
//             if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
//                 ip = alias.address
//             }
//         }
//     }
//     return ip
// }