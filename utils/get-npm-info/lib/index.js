'use strict'
const urlJoin = require('url-join')
const axios = require('axios')
const semver = require('semver')
module.exports = { getNpmInfo, getNpmVersion, getNpmSemverVersion }

async function getNpmInfo(npmName, register) {
  if (!npmName) {
    return null
  }
  const registerUrl = register || getDefaultRegistry()

  const npmInfoUrl = urlJoin(registerUrl, npmName)
  return axios
    .get(npmInfoUrl)
    .then((res) => {
      if (res.status === 200) {
        return res.data
      }
      return null
    })
    .catch((err) => {
      return Promise.reject(err)
    })
}
function getDefaultRegistry(isOriginal = false) {
  return isOriginal
    ? 'https://registry.npmjs.org'
    : 'https://registry.npm.taobao.org'
}

async function getNpmVersion(npmName, register) {
  const data = await getNpmInfo(npmName, register)
  if (data) {
    return Object.keys(data.versions)
  } else {
    return []
  }
}

function getNpmSemverVersions(baseVersion, versions) {
  const newVersions = versions
    .filter((version) => {
      return semver.satisfies(version, `^${baseVersion}`)
    })
    .sort((a, b) => semver.gt(b, a))
  return newVersions
}

async function getNpmSemverVersion(npmName, baseVersion, registry) {
  const versions = await getNpmVersion(npmName, registry)
  const newVersions = getNpmSemverVersions(baseVersion, versions)
  if (newVersions && newVersions.length > 0) {
    return newVersions[0]
  }
  return null
}
