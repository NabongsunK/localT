const AuthModel = require("../models/user.AuthModel");
const LoginModel = require("../models/user.LoginModel");
const pool = require("../models/pool");
const FindModel = require("../models/user.findModel");
require("date-utils");

//로그인상태를 어떻게 구별하지?
//authDB랑 연결을 어떻게? 왜 시키지?
//로그인시도일때 비밀번호만 틀렸을떄 알려주기

const UserService = {
  async getAuth(article) {
    //article = {login_id,phone_number}
    const conn = await pool.getConnection();
    try {
      // 트랜젝션 작업 시작
      await conn.beginTransaction();

      // userDB에 중복아이디가 1개라도 있으면
      const sameIdsAtUserDB = await LoginModel.findSameLoginIdNum(
        article,
        conn
      );
      if (sameIdsAtUserDB > 0) {
        return { ok: false, message: "중복아이디" };
      }

      // auth에서 중복 제거작업
      const same = await AuthModel.findSame(article, conn);
      let ch = true;
      let id = 0;
      same.forEach(async function (element) {
        var curTime = new Date();
        var beginTime = new Date(element.curr_time);
        var endTime = new Date(element.expiration_time);

        // 해당 인증정보가 유효하지않으면
        if (
          curTime.getTime() < beginTime.getTime() ||
          curTime.getTime() > endTime.getTime()
        ) {
          //해당정보 삭제
          await AuthModel.deleteByPID(element.id, conn);
        } else {
          // 유효한 정보가 있으면 해당 id 저장
          ch = false;
          id = element.id;
        }
      });
      // 없으면 인증번호 생성후 해당 id 저장
      if (ch) {
        const auth = Math.floor(Math.random() * 65535)
          .toString(16)
          .toUpperCase();
        const now = new Date();
        var end = new Date();
        end.setMinutes(end.getMinutes() + 3);
        article = {
          ...article,
          authentication_number: auth,
          curr_time: now,
          expiration_time: end,
        };
        id = await AuthModel.insertAuth(article, conn);
      }
      // result = {id,curr_time,expiration_time,count,authentication_number}
      const data = await AuthModel.getAuthByPID(id, conn);
      await AuthModel.postSms(article.phone_number, data.authentication_number);
      // DB에 작업 반영
      await conn.commit();
      // return { ...data, ok: true };
      return { ok: true };
    } catch (err) {
      // DB 작업 취소
      await conn.rollback();
      throw new Error("Service Error", { cause: err });
    } finally {
      // 커넥션 반납
      pool.releaseConnection(conn);
    }
  },

  async doAuth(article) {
    // article = {login_id,phone_number,authentication_number}
    const conn = await pool.getConnection();
    try {
      // 트랜젝션 작업 시작
      await conn.beginTransaction();
      const getPid = await AuthModel.checkAuth(article, conn);
      const data = await AuthModel.getAuthByPID(getPid.id, conn);

      var curTime = new Date();
      var beginTime = new Date(data.curr_time);
      var endTime = new Date(data.expiration_time);

      if (data.authentication_number === article.authentication_number) {
        // 인증 완료
        if (
          curTime.getTime() >= beginTime.getTime() &&
          curTime.getTime() <= endTime.getTime()
        ) {
          await AuthModel.deleteByPID(getPid.id, conn);
          await conn.commit();
          return { ok: true };
        }
        // 인증번호는 맞으나 시간지남
        await AuthModel.deleteByPID(getPid.id, conn);
        await conn.commit();
        return { ok: false, message: "인증시간만료" };
      }
      // 인증번호 많이틀림
      if (data.counter > 4) {
        await AuthModel.deleteByPID(getPid.id, conn);
        await conn.commit();
        return { ok: false, message: "인증번호5회실패" };
      }
      // 시간은맞는데, 틀림
      if (
        curTime.getTime() >= beginTime.getTime() &&
        curTime.getTime() <= endTime.getTime()
      ) {
        await AuthModel.plusCounter(getPid.id, conn);
        await conn.commit();
        return { ok: false, message: "인증번호틀림" };
      }
      // DB에 작업 반영
      // 시간도 끝났고 틀림
      await AuthModel.deleteByPID(getPid.id, conn);
      await conn.commit();
      return { ok: false, message: "인증시간만료" };
    } catch (err) {
      // DB 작업 취소
      await conn.rollback();
      throw new Error("Service Error", { cause: err });
    } finally {
      // 커넥션 반납
      pool.releaseConnection(conn);
    }
  },
  async signIn(article) {
    // article = {login_id,password}
    const conn = await pool.getConnection();
    try {
      // 트랜젝션 작업 시작
      await conn.beginTransaction();
      const getPid = await LoginModel.findSame(article, conn);
      if (!getPid || !getPid.id) {
        throw new Error("사용자를 찾을 수 없습니다.");
      }
      await LoginModel.chTrue(getPid.id, conn);
      await LoginModel.chTrue(getPid.id, conn);
      //여기에 로그인실패(패스워드, 없는닉네임 추가할것)
      await conn.commit();
      return { ok: true, message: "로그인완료", user_id: getPid.id };
    } catch (err) {
      // DB 작업 취소
      await conn.rollback();
      throw new Error("Service Error", { cause: err });
    } finally {
      // 커넥션 반납
      pool.releaseConnection(conn);
    }
  },
  async signOut(article) {
    // article = {login_id,password}
    const conn = await pool.getConnection();
    try {
      // 트랜젝션 작업 시작
      await conn.beginTransaction();
      const getPid = await LoginModel.findSame(article, conn);
      await LoginModel.chFalse(getPid.id, conn);
      await conn.commit();
      return { ok: true, message: "로그아웃완료", user_id: getPid.id };
    } catch (err) {
      // DB 작업 취소
      await conn.rollback();
      throw new Error("Service Error", { cause: err });
    } finally {
      // 커넥션 반납
      pool.releaseConnection(conn);
    }
  },
  async signUp(article) {
    // article = {login_id,phone_number,password,role,email,name}
    const conn = await pool.getConnection();
    try {
      // 트랜젝션 작업 시작
      await conn.beginTransaction();
      const user_id = await LoginModel.insertUser(article, conn);
      await conn.commit();
      return { ok: true, message: "회원가입완료", user_id: user_id };
    } catch (err) {
      // DB 작업 취소
      await conn.rollback();
      throw new Error("Service Error", { cause: err });
    } finally {
      // 커넥션 반납
      pool.releaseConnection(conn);
    }
  },
  async getUserById(article) {
    const conn = await pool.getConnection();
    try {
      // 트랜젝션 작업 시작
      await conn.beginTransaction();
      const data = await LoginModel.getUserById(article.user_id, conn);
      await conn.commit();
      return { data };
    } catch (err) {
      // DB 작업 취소
      await conn.rollback();
      throw new Error("Service Error", { cause: err });
    } finally {
      // 커넥션 반납
      pool.releaseConnection(conn);
    }
  },
  async getSlt() {
    const conn = await pool.getConnection();
    try {
      // 트랜젝션 작업 시작
      await conn.beginTransaction();
      const data = await LoginModel.getSlt();
      await conn.commit();
      return data;
    } catch (err) {
      // DB 작업 취소
      await conn.rollback();
      throw new Error("Service Error", { cause: err });
    } finally {
      // 커넥션 반납
      pool.releaseConnection(conn);
    }
  },

  async findPwGetAuth(article) {
    //article = {login_id,phone_number}
    const conn = await pool.getConnection();
    try {
      // 트랜젝션 작업 시작
      await conn.beginTransaction();

      // userDB에 아이디,전화번호가 같은것이 가 1개라도 없으면
      const sameIdsAtUserDB = await FindModel.findSameLoginIdNum(article, conn);
      if (sameIdsAtUserDB == 0) {
        return { ok: false, message: "해당정보없음" };
      }

      // auth에서 중복 제거작업
      const same = await AuthModel.findSame(article, conn);
      let ch = true;
      let id = 0;
      same.forEach(async function (element) {
        var curTime = new Date();
        var beginTime = new Date(element.curr_time);
        var endTime = new Date(element.expiration_time);

        // 해당 인증정보가 유효하지않으면
        if (
          curTime.getTime() < beginTime.getTime() ||
          curTime.getTime() > endTime.getTime()
        ) {
          //해당정보 삭제
          await AuthModel.deleteByPID(element.id, conn);
        } else {
          // 유효한 정보가 있으면 해당 id 저장
          ch = false;
          id = element.id;
        }
      });
      // 없으면 인증번호 생성후 해당 id 저장
      if (ch) {
        const auth = Math.floor(Math.random() * 65535)
          .toString(16)
          .toUpperCase();
        const now = new Date();
        var end = new Date();
        end.setMinutes(end.getMinutes() + 3);
        article = {
          ...article,
          authentication_number: auth,
          curr_time: now,
          expiration_time: end,
        };
        id = await AuthModel.insertAuth(article, conn);
      }
      // result = {id,curr_time,expiration_time,count,authentication_number}
      const data = await AuthModel.getAuthByPID(id, conn);
      await AuthModel.postSms(article.phone_number, data.authentication_number);
      // DB에 작업 반영
      await conn.commit();
      // return { ...data, ok: true };
      return { ok: true };
    } catch (err) {
      // DB 작업 취소
      await conn.rollback();
      throw new Error("Service Error", { cause: err });
    } finally {
      // 커넥션 반납
      pool.releaseConnection(conn);
    }
  },
  // 비밀번호번경
  async changePw(article) {
    // article = {login_id, newPassword}
    const conn = await pool.getConnection();
    try {
      // 트랜젝션 작업 시작
      await conn.beginTransaction();
      const password = await FindModel.changePw(
        article.login_id,
        article.newPassword
      );
      await conn.commit();
      return { ok: true, message: "비밀번호변경완료", password: password };
    } catch (err) {
      // DB 작업 취소
      await conn.rollback();
      throw new Error("Service Error", { cause: err });
    } finally {
      // 커넥션 반납
      pool.releaseConnection(conn);
    }
  },

  async getQR(article) {
    //article = {login_id,phone_number}
    const conn = await pool.getConnection();
    try {
      // 트랜젝션 작업 시작
      await conn.beginTransaction();
      const data = await AuthModel.getQR(article.query);
      // DB에 작업 반영
      await conn.commit();
      // return { ...data, ok: true };
      return { ok: true, url: data + ".qr" };
    } catch (err) {
      // DB 작업 취소
      await conn.rollback();
      throw new Error("Service Error", { cause: err });
    } finally {
      // 커넥션 반납
      pool.releaseConnection(conn);
    }
  },
};

module.exports = UserService;
