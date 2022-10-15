/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 * 
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
 const { ipcRenderer } = require("electron")
 window.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('song-word')
    // console.log(el)
    let timer = null
    el.addEventListener('mouseenter', () => {
      clearTimeout(timer)
      console.log('set-ignore-mouse-events-enter')
      setTimeout(()=>{
        el.style.cursor = 'move'
        ipcRenderer.send('set-ignore-mouse-events', false)
      },5000)
    })
    el.addEventListener('mouseleave', () => {
      clearTimeout(timer)
      el.style.cursor = ''
      ipcRenderer.send('set-ignore-mouse-events', true, { forward: true })
      console.log('set-ignore-mouse-events-leave')
    })
  })