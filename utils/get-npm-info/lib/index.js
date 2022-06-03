'use strict';

module.exports = getNpmInfo;
const axios = require('axios')
const urlJoin = import('url-join')
const semver = require('semver')
function getNpmInfo(npmName,registry) {
    console.log('npmName',npmName);
    if(!npmName){
        return
    }
    const registryUrl = registry || getDefaultRegistry()
     urlJoin.then(res=>{
        const npmUrl =   res.default(registryUrl,npmName)
    console.log('npmUrl',npmUrl);
        axios.get(npmUrl).then(res3=>{
            let data = res3.data
            
        })
    })
}
function getDefaultRegistry(isOrigin = true){
    return isOrigin?"https://registry.npmjs.org/":"https://registry.npm.taobao.org/"
}
module.exports  = getNpmInfo
