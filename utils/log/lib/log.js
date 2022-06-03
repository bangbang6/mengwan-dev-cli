'use strict';

const log2 = require('npmlog')
log2.addLevel('success', 2500, { fg: 'green', bold:true })
log2.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL :"info"
log2.heading = 'mengwan'
log2.headingStyle = { fg: 'green', bg: 'black' }
module.exports = log2;

