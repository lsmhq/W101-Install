const ffi = require('ffi-napi')
var ref = require("ref");
// Wizard Graphical Client

let user32 = ffi.Library('user32.dll',{
    FindWindowW:["int32",["string","string"]],
	GetWindow: ["int32",["int32","int32"]],
	SendMessageW: ["int32",["int32","uint","uint64","int64"]]
})




function strBuf(str) {
    //return Buffer.from(`${text}\0`, "ucs2");
    return Buffer.from(str+'\0','ucs2');
  }
function getControls(hwnd, indices) {
    const GW_CHILD = 5;
    const GW_HWNDNEXT = 2;
   
    const controls = {};
   
    const map = [];
    for (let key in indices) {
      map[indices[key]] = key;
    }
    let childhwnd = user32.GetWindow(hwnd, GW_CHILD);
    let index = 0;
    while (isValidHandle(childhwnd)) {
      if (map[index]) {
        controls[map[index]] = childhwnd;
      }
      childhwnd = user32.GetWindow(childhwnd, GW_HWNDNEXT);
      index++;
    }
    return controls;
  }
  

function isValidHandle(hwnd) {
    return typeof hwnd === 'number' && hwnd > 0
      || typeof hwnd === 'bigint' && hwnd > 0
      || typeof hwnd === 'string' && hwnd.length > 0;
}

function click(hwnd){
	const BM_CLICK = 0xF5;
	user32.SendMessageW(hwnd, BM_CLICK, 0, 0);
}
 
function input(hwnd,str){
	const WM_SETTEXT = 0x000C;
	const addr = ref.address(strBuf(str));
	console.log(addr);
	user32.SendMessageW(hwnd,WM_SETTEXT,0,addr);
}
 
 
async function login(){
	var hwnd = user32.FindWindowW(null,strBuf("loginapp"));
	var indices = {accoutlabel:0,passwordlabel:1,account:2,password:3,submit:4,cancel:5};
	var controls = getControls(hwnd,indices);
	console.log(controls);
	input(controls.account,"admin");
	await delay(100);
	input(controls.password,"123456");
	await delay(100);
	click(controls.submit);
}
 
login();


async function delay(milliseconds){
	return new Promise(resolve=>setTimeout(resolve,milliseconds));
}