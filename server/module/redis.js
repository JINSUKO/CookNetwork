const express = require('express');
const dotenv = require('dotenv');
const redis = require('redis')

require('dotenv').config({ path: '.env.local' });

const createClient = ()=>{
    return redis.createClient({url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
    // legacyMode: true, // 최신 레디스는 Promise 기반으로 작동하나 콜백 기반 코드를 사용하려면 'legacyMode: true'로 설정해야함
})
};

const insertToken = async (key, value) =>{
    const redisClient = createClient()
    const refreshTokenTTL = 12 * 60 * 60; // 12시간 
    try{
        await redisClient.connect();
        await redisClient.set(key,JSON.stringify(value),{
            EX: refreshTokenTTL
        });
    }catch(error){
        console.error('jti 작성 중 오류 발생: ',error);
        throw error;
    }finally{
        await redisClient.quit();
    }
    return {response: 'redis 작성 완료'}
}

const selectToken = async (key) =>{
    const redisClient = createClient()
    try{
        await redisClient.connect();
        const jti = await redisClient.get(key);
    }catch(error){
        console.error('jti 확인 중 오류 발생: ',error);
        throw error;
    }finally{
        await redisClient.quit();
    }
    return jti; // 값이 없으면 null을 반환
}

const deleteToken = async(key) =>{
    const redisClient = createClient()
    try{
        await redisClient.connect();
        const n = await redisClient.exists(key)
        if(n>0) await redisClient.del(key);
    }catch(error){
        console.error('jti 삭제 중 오류 발생: ',error);
        throw error;
    }finally{
        await redisClient.quit();
    }
    return {response: 'redis 삭제 완료'}
}

const appendBlacklist = async(key,value) =>{
    const redisClient = createClient()
    const listExpired = 30 * 60; // 30q분
    try{
        await redisClient.connect();
        await redisClient.set(key,value,{
            EX: listExpired
        });
    }catch(error){
        console.error('블랙리스트 작성 중 오류 발생:', error)
        throw error;
    }finally{
        await redisClient.quit();
    }
}

const checkToken = async(key) =>{
    const redisClient = createClient()
    let result = null;
    try{
        await redisClient.connect();
        result = await redisClient.exists(key)
    }catch(error){
        console.error('블랙리스트 확인 중 오류 발생:', error)
        throw error;
    }finally{
        await redisClient.quit();
    }
    return result;
}

module.exports = {insertToken, selectToken, deleteToken , appendBlacklist, checkToken}