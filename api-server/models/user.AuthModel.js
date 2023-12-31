const pool = require("./pool");
const axios = require("axios");
const CryptoJS = require("crypto-js");
const test = axios.create({
  baseURL: "https://sens.apigw.ntruss.com",
});
const test2 = axios.create({
  baseURL: "https://naveropenapi.apigw.ntruss.com/util/v1",
});
const AuthModel = {
  // 중복검사
  async findSame(article, conn = pool) {
    try {
      // article = {login_id,phone_number}
      const sql = `
      select
        id,
        DATE_FORMAT(curr_time, '%Y-%m-%d %H:%i:%s') as curr_time, 
        DATE_FORMAT(expiration_time,  '%Y-%m-%d %H:%i:%s') as expiration_time
      from auth
      where
        login_id = ? and
        phone_number = ?
      `;
      const [result] = await conn.query(sql, [
        article.login_id,
        article.phone_number,
      ]);
      return result;
    } catch (err) {
      throw new Error("DB Error", { cause: err });
    }
  },

  // id정보 등록
  async insertAuth(article, conn = pool) {
    try {
      // article = {login_id,phone_number,authentication_number,curr_time,expiration_time}
      const sql = `insert into auth set ?`;
      const [result] = await conn.query(sql, [article]);
      return result.insertId;
    } catch (err) {
      throw new Error("DB Error", { cause: err });
    }
  },

  // 인증정보 리턴
  async getAuthByPID(id, conn = pool) {
    try {
      const sql = `
      select
        id, 
        DATE_FORMAT(curr_time, '%Y-%m-%d %H:%i:%s') as curr_time, 
        DATE_FORMAT(expiration_time,  '%Y-%m-%d %H:%i:%s') as expiration_time, 
        count, 
        authentication_number
      from auth
      where id = ?
        `;
      const [result] = await conn.query(sql, [id]);
      return result[0];
    } catch (err) {
      throw new Error("DB Error", { cause: err });
    }
  },

  // 해당정보 삭제
  async deleteByPID(id, conn = pool) {
    try {
      const sql = `delete from auth where id = ?`;
      await conn.query(sql, [id]);
      return true;
    } catch (err) {
      throw new Error("DB Error", { cause: err });
    }
  },

  // 인증번호조회
  async checkAuth(article, conn = pool) {
    // article = {id,phoneNumber,auth}
    // res = {id}
    try {
      const sql = `select id from auth where login_id=? and phone_number=?`;
      const [result] = await conn.query(sql, [
        article.login_id,
        article.phone_number,
      ]);
      return result[0];
    } catch (err) {
      throw new Error("DB Error", { cause: err });
    }
  },

  // 카운트증가
  async plusCounter(id, conn = pool) {
    try {
      const sql = `update auth set count = count+1 where id = ?`;
      await conn.query(sql, [id]);
      return true;
    } catch (err) {
      throw new Error("DB Error", { cause: err });
    }
  },

  async postSms(phone_number, authentication_number) {
    const url =
      "/sms/v2/services/ncp%3asms%3akr%3a314852427266%3alocalt/messages";
    const body = {
      type: "SMS",
      from: "01020597105",
      content: `loca!T`,
      messages: [
        {
          to: phone_number,
          content: `[loca!T] 인증번호 [${authentication_number}]를 입력해 주세요.`,
        },
      ],
    };
    const currentTime = Date.now().toString();
    const access_key = process.env.DB_NAVER_POSTSMS_ACCESS_KEY;
    const secret_key = process.env.DB_NAVER_POSTSMS_SECRET_KEY;
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      "x-ncp-apigw-timestamp": currentTime,
      "x-ncp-iam-access-key": access_key,
      "x-ncp-apigw-signature-v2": this.makeSignature(
        access_key,
        secret_key,
        currentTime
      ),
    };

    const res = await test.post(url, body, { headers: headers });
    return res;
  },

  async getQR(query) {
    const url = "/shorturl?url=" + query;
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      "X-NCP-APIGW-API-KEY-ID": process.env.DB_NAVER_GETQR_API_KEY_ID,
      "X-NCP-APIGW-API-KEY": process.env.DB_NAVER_GETQR_API_KEY,
    };

    const res = await test2.get(url, { headers: headers });

    return res.data.result.url;
  },

  makeSignature(access_key, secret_key, time) {
    var space = " "; // one space
    var newLine = "\n"; // new line
    var method = "POST"; // method
    var url =
      "/sms/v2/services/ncp%3asms%3akr%3a314852427266%3alocalt/messages"; // url (include query string)
    var timestamp = time; // current timestamp (epoch)
    var accessKey = access_key; // access key id (from portal or Sub Account)
    var secretKey = secret_key; // secret key (from portal or Sub Account)

    var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
    hmac.update(method);
    hmac.update(space);
    hmac.update(url);
    hmac.update(newLine);
    hmac.update(timestamp);
    hmac.update(newLine);
    hmac.update(accessKey);

    var hash = hmac.finalize();
    return hash.toString(CryptoJS.enc.Base64);
  },
};

module.exports = AuthModel;
