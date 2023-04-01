'use strict'
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/yargs')

console.log('2', 2)

/** 解析命令 */
const arg = hideBin(process.argv)
console.log('arg', arg)
yargs(arg).argv
