const {delayTime}=require('../config/appconfig');

module.exports.delay=async (request,response,next)=>{

    // wait delayTime[ms] to show animation
    await new Promise(resolve => setTimeout(resolve, delayTime));

    next();
}