import './App.css';
import { Button } from '@arco-design/web-react';
function App() {
  return (
    <div className="App">
      <Button type='primary' onClick={()=>{
        window.electronAPI.setTitle('123')
        // document.title = '123123'
      }}>测试按钮</Button>
    </div>
  );
}

export default App;
