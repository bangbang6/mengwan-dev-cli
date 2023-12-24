#!/usr/bin/env node

// 本地安装 非全局link安装
const importLocal = require('import-local')
const commander = require('commander')
const pkg = require('../package.json')
const program = new commander.Command()

if (importLocal(__filename)) {
  // mw-cli本地版本是指 node_modules中安装了这个包 说明已经发布过这个包了 然后npm install在node_modules里
  //如果是npm link的话 是安装D盘的全局node_modules下那么就会走else
  require('npmlog').info('cli', '正在使用mw-cli本地版本')
} else {
  require('../bin')(process.argv.slice(2))
}
