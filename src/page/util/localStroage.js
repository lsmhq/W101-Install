class LocalStorage_subata{
    /**  
     * @Description 初始化设置 { filter: ['key']}
     * @params option - 初始化设置，filter: String: [], 传入key的数组过滤掉 
    **/ 
    constructor(
        option = {
            filter:[]
        }
    ){

        this.filter = option.filter
    }

    /**  
     * @Description 新增更新某项
     * @param key - String
     * @param item - any
    **/ 
    setItem = (key, item)=>{
        let type = typeof item
        let typeArr = ['object']
        if(typeArr.includes(type)){
            localStorage.setItem(key, JSON.stringify(item))
        }else{
            localStorage.setItem(key, item)
        }
    }
    /**  
     * @Description 获取某项
     * @param key - String
     * @return any
    **/ 
    getItem = (key)=>{
        try {
            return JSON.parse(localStorage.getItem(key))
        } catch (error) {
            return localStorage.getItem(key)
        }
        
    }

    /**  
     * @Description 清空某项
     * @param key - String
    **/ 
    clearItem = (key)=>{
        localStorage.removeItem(key)
    }

    /**  
     * @Description 清空
    **/ 
    clear = ()=>{
        localStorage.clear()
    }
    /**  
     * @Description 导出
     * @return Json
    **/ 
    outPutToJson = ()=>{
        let keys = this.getKeys()
        let jsonObj = {}
        keys.forEach(key => {
            if(!this.filter.includes(key)){
                jsonObj[key] = this.getItem(key)
            }     
        });
        return JSON.stringify(jsonObj) 
    }
    /**  
     * @Description 导出
     * @return any
    **/ 
    outPutToObj = ()=>{
        let keys = this.getKeys()
        let jsonObj = {}
        keys.forEach(key => {
            if(!this.filter.includes(key)){
                jsonObj[key] = this.getItem(key)
            }     
        });
        return jsonObj
    }
    /**  
     * @Description 导出
     * @param json String
    **/ 
    inputLocalStroage = (json)=>{
        let jsonObj = JSON.parse(json)
        for (const key in jsonObj) {
            if (Object.hasOwnProperty.call(jsonObj, key)) {
                const element = jsonObj[key];
                this.setItem(key, element)
            }
        }
    }
    /**  
     * @Description 获取所有key
     * @return String:[]
    **/ 
    getKeys = ()=>{
        let keys = []
        for (let index = 0; index < localStorage.length; index++) {
            keys.push(localStorage.key(index))
        }
        return keys
    }
}

export default LocalStorage_subata