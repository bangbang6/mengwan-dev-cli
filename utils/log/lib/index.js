'use strict';

/** 对npmlog进行封装 */
const log = require('npmlog')
/** 2000当前success的level值 npmlog下默认的是2000 超过就打印 */
log.addLevel('success',2000,{fg:'green',bold:true})
/** 设置默认level 覆盖npmlog的info */
log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info'
/** 设置打印前缀以及样式 */
log.heading = 'author: mengwan@alibaba'
log.headingStyle  = {fg:'blue',bold:true}
module.exports = log;

