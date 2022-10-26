class LocalStorage_subata{

    setItem = (key, item)=>{
        let type = typeof item
        let typeArr = ['object']
        if(typeArr.includes(type)){
            localStorage.setItem(key, JSON.stringify(item))
        }else{
            localStorage.setItem(key, item)
        }
    }

    getItem = (key)=>{
        try {
            return JSON.parse(localStorage.getItem(key))
        } catch (error) {
            return localStorage.getItem(key)
        }
        
    }

    clearItem = (key)=>{
        localStorage.removeItem(key)
    }

    clear = ()=>{
        localStorage.clear()
    }

    outPutToJson = ()=>{
        let keys = this.getKeys()
        let jsonObj = {}
        keys.forEach(key => {
                jsonObj[key] = this.getItem(key)
        });
        return JSON.stringify(jsonObj) 
    }

    outPutToObj = ()=>{
        let keys = this.getKeys()
        let jsonObj = {}
        keys.forEach(key => {
                jsonObj[key] = this.getItem(key)
        });
        return jsonObj
    }
    
    getKeys = ()=>{
        let keys = []
        for (let index = 0; index < localStorage.length; index++) {
            keys.push(localStorage.key(index))
        }
        return keys
    }
}

export default LocalStorage_subata