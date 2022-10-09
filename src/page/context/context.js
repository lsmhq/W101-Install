import { createContext } from 'react'
let songStatus = createContext({
    progress:{
        current:0,
        total:0
    }
})
let songId = createContext(0)
export {
    songStatus,
    songId
} 