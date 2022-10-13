import { Drawer, Input, List } from "@arco-design/web-react"
import { useContext, useEffect, useState } from "react"
import globalData from "../../context/context"
import { api } from "../../util/http"
import { debounce } from "../../util/util"
import'./searchBar.css'
function SearchBar(){
    let [keyWord, setKeyWord] = useState('')
    let [suggest, setSuggest] = useState([])
    let [drawer, setDrawer] = useState(false)
    let globalObj = useContext(globalData)
    useEffect(()=>{
        if(keyWord.length > 0){
            debounce(()=>{
                api.suggest({ keywords: keyWord}).then(res=>{
                    console.log(res.data)
                    if(res.data.code === 200){
                        setSuggest([...res.data.result?.allMatch||[]])
                    }
                })
            }, 800)()
        }
        if(keyWord.length <= 0){
            setTimeout(() => {
                setSuggest([])
            }, 1000);
        }
    },[keyWord])
    useEffect(() => {
        if(suggest.length>0){
            setDrawer(true)
        }
        if(suggest.length<=0){
            setDrawer(false)
        }
        return () => {
            
        };
    }, [suggest])
    return <div className="searchBar">
        <Input.Search 
            placeholder="搜索" 
            className='searchBar-input' 
            value={keyWord} 
            onKeyDown={(e)=>{
                // console.log(e.keyCode)
                if(e.keyCode === 13){
                    setKeyWord('')
                    setSuggest([])
                    globalObj.keyword.setKeyWord(keyWord)
                    sessionStorage.setItem('keyword', keyWord)
                    window.location.hash = `/search?keyword=${keyWord}`
                }
            }} 
            onChange={(val)=>{
                setKeyWord(val)
            }}
        />
        <Drawer
            mask={false}
            style={{top:'50px', width:'300px', right:'100px',maxHeight:'300px', borderRadius:"5px", boxShadow:'0px 6px 10px rgb(199, 199, 199)'}}
            placement={'top'}
            closable={false}
            onCancel={()=>{
                setDrawer(false)
            }}
            focusLock={false}
            autoFocus={false}
            visible={drawer}
            footer={null}
            title={null}
            children={<List 
                dataSource={suggest}
                render={(item, idx)=>{
                    return <List.Item onClick={()=>{
                        setKeyWord('')
                        setSuggest([])
                        globalObj.keyword.setKeyWord(item.keyword)
                        sessionStorage.setItem('keyword', item.keyword)
                        window.location.hash = `/search?keyword=${item.keyword}`
                    }} key={idx}>
                        {item.keyword}
                    </List.Item>
                }}
            />}
        />
    </div>
}

export default SearchBar