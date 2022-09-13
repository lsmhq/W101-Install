import { Message } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import './App.css';
import Main from './page/main';
function App() {
  let [show, setShow] = useState(false)
  // getSteam() 
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
    console.log('加载')
    window.electronAPI.getScale((scale)=>{
      console.log(scale)
      document.body.style.zoom = 1-(scale - 1)
      console.log(1-(scale - 1))
    })
    if(localStorage.getItem('userid') === null){
      localStorage.setItem('userid',Math.random())
    }  
  }, [])
  return (
    <div className="App">
      <Main/>
    </div>
  );
}

export default App;
