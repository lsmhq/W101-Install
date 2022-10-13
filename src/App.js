import { Modal, Drawer } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import './App.css';
import Login from './page/components/Login';
import Main from './page/main';
import { api } from './page/util/http';
import UserInfo from './page/components/userInfo'

let login_timer

function App() {
  let [login, setLogin] = useState(false)
  let [userInfo, setUserInfo] = useState(false)
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
    api.checkLogin({}).then(res=>{
      console.log(res.data)
      if(res.data.data.code === 200 && res.data.data.profile){
        localStorage.setItem('account', JSON.stringify(res.data.data.account))
        localStorage.setItem('userInfo', JSON.stringify(res.data.data.profile))
      }
    })
  }, [])
  return (
    <div className="App">
      <Main login = {(op)=>{
        api.checkLogin({}).then(res=>{
          // console.log(res.data)
          
          if(res.data.data.code === 200 && res.data.data.profile){
            localStorage.setItem('account', JSON.stringify(res.data.data.account))
            localStorage.setItem('userInfo', JSON.stringify(res.data.data.profile))
            // 已登录状态
            setUserInfo(true)
          }else{
            setLogin(op)
          }
        })
      }}/>
      <Modal
        // title={'登录'}
        autoFocus={false}
        unmountOnExit
        style={{
          width: '300px',
          height:'260px'
        }}
        children={<Login closed={login} close={()=>{
          setLogin(false);
          api.checkLogin({}).then(res=>{
            if(res.data.data.code === 200 && res.data.data.profile){
              localStorage.setItem('account', JSON.stringify(res.data.data.account))
              localStorage.setItem('userInfo', JSON.stringify(res.data.data.profile))
              // 已登录状态
              setUserInfo(true)
            }
          })
        }} login_timer = {login_timer}/>}
        visible={login}
        onCancel={()=>{
          setLogin(false)
          clearInterval(login_timer)
        }}
        footer = {null}
      />
      <Drawer
        mask={false}
        style={{top:'50px', width:'200px', right:'10px',height:'180px', maxHeight:'300px', borderRadius:"5px", boxShadow:'0px 6px 10px rgb(199, 199, 199)'}}
        placement={'top'}
        onCancel={()=>{
          setUserInfo(false)
        }}
        autoFocus={false}
        visible={userInfo}
        footer={null}
        title={null}
        children={<UserInfo close={()=>{
          setUserInfo(false)
        }}/>}
      />
    </div>
  );
}
export default App;
