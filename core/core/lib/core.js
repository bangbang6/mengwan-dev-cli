#!/usr/bin/env node

// 本地安装 非全局link安装
const importLocal = require('import-local')

if(importLocal(__filename)){
  require('npmlog').info('cli','正在使用mw-cli本地版本1')
}else{
  require('../bin')(process.argv.slice(2))
}