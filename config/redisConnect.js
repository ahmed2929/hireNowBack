const redis =require("redis");

const redis_client =redis.createClient(process.env.REDIS_PORT,process.env.REDIS_HOST);

redis_client.on("connect",()=>{
    console.debug("redis server connected")
})

module.exports={
    redis_client
}