'use strict'
const { isObject } = require('@mengwan-dev-cli/utils')

const pkgDir = require('pkg-dir')

/** 后续可实例化一个package包 --> 对应npm包 */
class Package {
  constructor(options) {
    if (!options || !isObject(options)) {
      throw new Error('Package类的options参数不为空')
    }
    //package路径
    this.targetPath = options.targetPath
    /** 缓存路径 */
    this.storePath = options.storePath
    /**  name */
    this.packageName = options.name
    /** version */
    this.packageVersion = options.version

    this.getRootFilePath()
  }
  /** 判断package是否存在 */
  exists() {}
  /** 更新package */
  updatePackage() {}
  /** 安装package */
  installPackage() {}
  /** 获取入口文件路径 */
  getRootFilePath() {
    /** 获取package.json所在目录 pkg-dir */
    console.log('this.targetPath', this.targetPath)
    const dir = pkgDir.sync(this.targetPath)
    console.log('dir', dir)
    /** 读取package.json require */
    /** 找到main/lib属性 */
    /** 路径兼容 */
  }
}

module.exports = Package
