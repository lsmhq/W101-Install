import { Modal } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import './App.css';
import Login from './page/components/Login';
import Main from './page/main';
function App() {
  let [login, setLogin] = useState(false)
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
  }, [])
  return (
    <div className="App">
      <Main login = {(op)=>{
        setLogin(op)
      }}/>
      <Modal
        title={'登录/注册'}
        style={{
          width: '500px',
          height:'500px'
        }}
        children={<Login/>}
        visible={login}
        onCancel={()=>{
          setLogin(false)
        }}
        footer = {null}
      />

    </div>
  );
}

  //获取屏幕缩放比例
  function getRatio(){
    var ratio=0;
    var screen=window.screen;
    var ua=navigator.userAgent.toLowerCase();
 
    if(window.devicePixelRatio !== undefined){
        ratio=window.devicePixelRatio;    
    }else if(~ua.indexOf('msie')){
        if(screen.deviceXDPI && screen.logicalXDPI){
            ratio=screen.deviceXDPI/screen.logicalXDPI;        
        }
    }else if(window.outerWidth !== undefined && window.innerWidth !== undefined){
        ratio=window.outerWidth/window.innerWidth;
    }
    if(ratio){
        ratio=Math.round(ratio*100);    
    }
    return ratio;
}
export default App;
