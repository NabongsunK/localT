const pool = require("./pool");

const LoginModel = {
  // 닉네임중복검사
  async findSameLoginIdNum(article, conn = pool) {
    try {
      // article = {login_id,password}
      const sql = `
      select
        id
      from users
      where
        login_id = ?
      `;
      const [result] = await conn.query(sql, [article.login_id]);
      return result.length;
    } catch (err) {
      throw new Error("DB Error", { cause: err });
    }
  },

  // 닉네임/비밀번호비교
  async findSame(article, conn = pool) {
    try {
      // article = {login_id,password}
      const sql = `
      select
        id
      from users
      where
        login_id = ? and
        password = ?
      `;
      const [result] = await conn.query(sql, [
        article.login_id,
        article.password,
      ]);
      return result[0];
    } catch (err) {
      throw new Error("DB Error", { cause: err });
    }
  },
  // signin
  async chTrue(id, conn = pool) {
    try {
      const sql = `update users set is_signed = true where id = ?`;
      await conn.query(sql, [id]);
      return true;
    } catch (err) {
      throw new Error("DB Error", { cause: err });
    }
  },
  // signout
  async chFalse(id, conn = pool) {
    try {
      const sql = `update users set is_signed = false where id = ?`;
      await conn.query(sql, [id]);
      return true;
    } catch (err) {
      throw new Error("DB Error", { cause: err });
    }
  },
  // id정보 등록
  async insertUser(article, conn = pool) {
    try {
      // article = {login_id,phone_number,password,role,email,name}
      const sql = `insert into users set ?`;
      const [result] = await conn.query(sql, [article]);
      return result.insertId;
    } catch (err) {
      throw new Error("DB Error", { cause: err });
    }
  },
  // id정보 등록
  async getUserById(id, conn = pool) {
    try {
      // article = {login_id,phone_number,password,role,email,name}
      const sql = `
      select
        name,
        email,
        phone_number,
        id,
        role
      from users
      where
        id = ?
      `;
      const [result] = await conn.query(sql, [id]);
      return result[0];
    } catch (err) {
      throw new Error("DB Error", { cause: err });
    }
  },
  // slt 가져오기
  async getSlt(conn = pool) {
    try {
      // article = {login_id,phone_number,password,role,email,name}
      const sql = `
      select
        a
      from slt
      `;
      const [result] = await conn.query(sql);
      return result[0].a;
    } catch (err) {
      throw new Error("DB Error", { cause: err });
    }
  },
};

module.exports = LoginModel;
