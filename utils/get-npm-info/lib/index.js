'use strict';

module.exports = getNpmInfo;
const axios = require('axios')
const urlJoin = import('url-join')
const semver = require('semver')
async function getNpmInfo(npmName,baseVersion,registry) {
    console.log('npmName',npmName);
    if(!npmName){
        return
    }
    const registryUrl = registry || getDefaultRegistry()
     const res = await urlJoin
     
     const npmUrl =   res.default(registryUrl,npmName)
     console.log('npmUrl',npmUrl);
     const res3 = await axios.get(npmUrl)
         let data = res3.data
         const versions = Object.keys(data.versions)
         console.log('versions',versions);
         const satVersions = getVersionSemver(baseVersion,versions)
         console.log('satVersions',satVersions);
         return satVersions && satVersions[0]
     
}
function getVersionSemver(baseVersion,versions){
    versions = versions.filter(item=>{
        return semver.satisfies(item,`^${baseVersion}`)
    }).sort((a,b)=>{
        return semver.gt(b,a)
    })
    return versions
}
function getDefaultRegistry(isOrigin = true){
    return isOrigin?"https://registry.npmjs.org/":"https://registry.npm.taobao.org/"
}
module.exports  = getNpmInfo
