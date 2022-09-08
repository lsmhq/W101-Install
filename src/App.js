import { useEffect } from 'react';
import './App.css';
import Main from './page/main';
function App() {
  useEffect(() => {
    document.onkeydown = function(){
      var e = window.event || arguments[0];
      if(e.keyCode === 123){    //屏蔽F12
          return false;
      }else if(e.ctrlKey && e.shiftKey && e.keyCode === 73){    //屏蔽Ctrl+Shift+I，等同于F12
          return false;
      }else if(e.shiftKey && e.keyCode === 121){    //屏蔽Shift+F10，等同于鼠标右键
          return false;
      }
  }
  }, [])
  return (
    <div className="App">
      <Main/>
    </div>
  );
}

export default App;
