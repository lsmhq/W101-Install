const { ipcRenderer } = require("electron")

/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 * 
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
window.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('live2d')
    console.log(el)
    document.addEventListener('mousemove',(e)=>{
      e.stopPropagation()
      ipcRenderer.send('set-ignore-mouse-events', false)
    })
    el.addEventListener('mouseenter', (e) => {
      e.stopPropagation()
      ipcRenderer.send('set-ignore-mouse-events', false)
      console.log('set-ignore-mouse-events-enter')
    })
    el.addEventListener('mouseleave', (e) => {
      e.stopPropagation()
      ipcRenderer.send('set-ignore-mouse-events', true, { forward: true })
      console.log('set-ignore-mouse-events-leave')
    })
})