var express = require('express');
var router = express.Router();


const BoardService = require('../services/board.service');

// 사용자 정보 입력
router.post('/getauthnum', async (req, res, next) => {
  // req.body = {id,phoneNumber}
  // res = {pid,currentTime,expirationTime,counter,auth}
  try{
    const result= await BoardService.getAuth(req.body);
    res.json(result);
  }catch(err){
    next(err);
  }
});

// 인증확인
router.post('/doauth', async (req, res, next) => {
  // req.body = {id,phoneNumber,auth}
  // res = {check}
  try{
    const result= await BoardService.doAuth(req.body);
    res.json(result);
  }catch(err){
    next(err);
  }
});


module.exports = router;