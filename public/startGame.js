const child = require('child_process')
function start(){
    let exe = "WizardGraphicalClient.exe -L login.us.wizard101.com 12000"
    child.execSync(`${exe}`)
}
start()
process.exit(1);