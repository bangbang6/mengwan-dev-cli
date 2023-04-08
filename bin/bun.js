#!/usr/bin/env node

const lib = require('mengwan-dev-cli-bin')
const argv = require('process').argv
const command = argv[2]

const options = argv.slice(3)
let [option,param] = options
// 某个命令的option
if(option){
  option = option.replace('--','')
  if(lib[command]){
    lib[command]({option,param})
  }else{
    console.log('请输入正确的命令')
  }
}
//全局option
if(command.startsWith('--') || command.startsWith('-')){
  const globalOption = command.replace(/--|-/g,'')
  if(globalOption === 'version' || globalOption === 'V'){
    console.log('2e.0.0')
  }
}
