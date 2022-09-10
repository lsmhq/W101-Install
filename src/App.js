import { Message } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import './App.css';
import Main from './page/main';
function App() {
  let [show, setShow] = useState(false)
  useEffect(() => {
      document.onkeydown = function(){
        var e = window.event || arguments[0];
        if(e.keyCode === 123){    //屏蔽F12
            return false;
        }else if(e.ctrlKey && e.shiftKey && e.keyCode === 73){    //屏蔽Ctrl+Shift+I，等同于F12
            return false;
        }else if(e.shiftKey && e.keyCode === 121){    //屏蔽Shift+F10，等同于鼠标右键
            return false;
        }else if(e.keyCode === 122){ // F11
          return false;
        }
    }
    if(localStorage.getItem('userid') === null){
      localStorage.setItem('userid',Math.random())
    }  
    getSteam() 
  }, [])
  function getSteam(){
    window.tools.getPath((stdout, stderr)=>{
      // console.log(stdout.split('InstallPath')[1].split('REG_SZ')[1].trim())
      let steamPath = stdout.split('InstallPath')[1].split('REG_SZ')[1].trim() + '\\' + 'steamapps\\common\\Wizard101\\'
      localStorage.setItem('steamPath', steamPath)
      localStorage.setItem('steamInstall', true)
    }, (error)=>{
      Message.warning('检测到未安装Steam')
      localStorage.setItem('steamInstall', false)
    }) 
  }
  return (
    <div className="App">
      <Main/>
    </div>
  );
}

export default App;
