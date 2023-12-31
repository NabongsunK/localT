const pool = require("./pool");
const csv = require("csv-parser");
const fs = require("fs");

const ExploreGetModel = {
  // 중복검사
  async getListMap(content_type_id, conn = pool) {
    try {
      let sql = "";
      if (content_type_id == "15") {
        sql = `
        select
          id,
          addr1,
          first_image2,
          title,
          map_x,
          map_y,
          content_type_id,
          datediff(event_end_date, now()) as d_day
        from festival_api
          where 
            content_type_id = ?
            And datediff(event_end_date, now())>-1
        `;
      } else {
        sql = `
        select
          id,
          addr1,
          first_image2,
          title,
          map_x,
          map_y,
          content_type_id
        from festival_api
          where 
            content_type_id = ?
        `;
      }

      const [result] = await conn.query(sql, [content_type_id]);
      return result;
    } catch (err) {
      throw new Error("DB Error", { cause: err });
    }
  },

  async getListMapByAreaCode(content_type_id, area_code, conn = pool) {
    try {
      let sql = "";
      if (content_type_id == "15") {
        sql = `
        select
          id,
          addr1,
          first_image2,
          title,
          map_x,
          map_y,
          content_type_id,
          datediff(event_end_date, now()) as d_day
        from festival_api
          where 
            content_type_id = ?
            And area_code = ?
            And datediff(event_end_date, now())>-1
        `;
      } else {
        sql = `
        select
          id,
          addr1,
          first_image2,
          title,
          map_x,
          map_y,
          content_type_id
        from festival_api
          where 
            content_type_id = ?
            And area_code = ?
        `;
      }

      const [result] = await conn.query(sql, [content_type_id, area_code]);
      return result;
    } catch (err) {
      throw new Error("DB Error", { cause: err });
    }
  },

  async getListParking() {
    try {
      const results = [];
      const parkingFilePath = "./models/parking.csv";
      fs.createReadStream(parkingFilePath)
        .pipe(csv({}))
        .on("data", (data) => results.push(data))
        .on("end", () => {});
      return results;
    } catch (err) {
      throw new Error("DB Error", { cause: err });
    }
  },
  async getListSelectParking() {
    try {
      const results = [];
      const parkingFilePath = "./models/parking.csv";

      fs.createReadStream(parkingFilePath)
        .pipe(csv({}))
        .on("data", (data) => {
          const selectedData = {
            id: data.id,
            map_x: data.map_x,
            map_y: data.map_y,
            title: data.title,
            content_type_id: "28",
            addr1: data.addr1,
          };
          results.push(selectedData);
        })
        .on("end", () => {});
      return results;
    } catch (err) {
      throw new Error("DB Error", { cause: err });
    }
  },
  async getListSelectParkingByAreaCode(area_code) {
    try {
      const reg = {
        1: "서울",
        31: "경기도",
        2: "인천",
        32: "강원",
        8: "세종특별자치시",
        3: "대전",
        34: "충청남도",
        33: "충청북도",
        5: "광주",
        38: "전라남도",
        37: "전라북도",
        6: "부산",
        4: "대구광역시",
        7: "울산",
        35: "경상북도",
        36: "경상남도",
        39: "제주",
      };
      const results = [];
      const parkingFilePath = "./models/parking.csv";

      fs.createReadStream(parkingFilePath)
        .pipe(csv({}))
        .on("data", (data) => {
          const selectedData = {
            id: data.id,
            map_x: data.map_x,
            map_y: data.map_y,
            title: data.title,
            content_type_id: "28",
            addr1: data.addr1,
          };
          if (data.addr1.indexOf(reg[area_code]) > -1) {
            results.push(selectedData);
          }
        })
        .on("end", () => {});
      return results;
    } catch (err) {
      throw new Error("DB Error", { cause: err });
    }
  },
  async getAllSelect(conn = pool) {
    try {
      const sql = `
      SELECT
        id,
        addr1,
        addr2,
        first_image,
        first_image2,
        tel,
        title,
        event_start_date,
        event_end_date,
        home_page,
        over_view,
        map_x,
        map_y,
        rec,
        datediff(event_end_date, now()) as d_day,
        area_code,
        price,
        deals
      FROM festival_api

      WHERE
        first_image IS NOT NULL
        AND title IS NOT NULL
        AND event_start_date IS NOT NULL
        AND event_end_date IS NOT NULL
        AND over_view IS NOT NULL
        And datediff(event_end_date, now())>-1
      ORDER BY event_end_date ASC
      `;
      const [result] = await conn.query(sql);
      return result;
    } catch (err) {
      throw new Error("DB Error", { cause: err });
    }
  },
  async getTypeSelect(type, conn = pool) {
    try {
      const sql = `
      SELECT
        id,
        addr1,
        addr2,
        first_image,
        first_image2,
        tel,
        title,
        event_start_date,
        event_end_date,
        home_page,
        over_view,
        map_x,
        map_y,
        rec,
        datediff(event_end_date, now()) as d_day,
        area_code,
        price
      FROM festival_api

      WHERE
        first_image IS NOT NULL
        AND title IS NOT NULL
        AND event_start_date IS NOT NULL
        AND event_end_date IS NOT NULL
        AND over_view IS NOT NULL
        and deals = ?
        And datediff(event_end_date, now())>-1
      ORDER BY event_end_date ASC
      `;
      const [result] = await conn.query(sql);
      return result;
    } catch (err) {
      throw new Error("DB Error", { cause: err });
    }
  },
  async getRegionSelect(query, conn = pool) {
    try {
      const sql = `
      SELECT
        id,
        addr1,
        addr2,
        first_image,
        first_image2,
        tel,
        title,
        event_start_date,
        event_end_date,
        home_page,
        rec,
        over_view,
        price,
        datediff(event_end_date, now()) as d_day
      FROM festival_api

      WHERE
        first_image IS NOT NULL
        AND title IS NOT NULL
        AND event_start_date IS NOT NULL
        AND event_end_date IS NOT NULL
        AND over_view IS NOT NULL
        AND addr1 Like ?
        And datediff(event_end_date, now())>-1
      ORDER BY event_start_date ASC
      `;
      const [result] = await conn.query(sql, [query]);
      return result;
    } catch (err) {
      throw new Error("DB Error", { cause: err });
    }
  },
  async getRegionSelectByAreaCode(area_code, conn = pool) {
    try {
      const sql = `
      SELECT
      id,
      addr1,
      addr2,
      first_image,
      first_image2,
      tel,
      title,
      event_start_date,
      event_end_date,
      home_page,
      rec,
      datediff(event_end_date, now()) as d_day,
      over_view,
      price
      FROM festival_api

      WHERE
      first_image IS NOT NULL
      AND title IS NOT NULL
      AND event_start_date IS NOT NULL
      AND event_end_date IS NOT NULL
      AND over_view IS NOT NULL
      AND area_code = ?
      And datediff(event_end_date, now())>-1
      ORDER BY event_start_date ASC
      `;
      const [result] = await conn.query(sql, [area_code]);
      return result;
    } catch (err) {
      throw new Error("DB Error", { cause: err });
    }
  },
  async getTicketById(id, conn = pool) {
    try {
      const sql = `
      SELECT
        id,
        addr1,
        first_image,
        title
      FROM festival_api
      WHERE
        id = ?
      `;
      const [result] = await conn.query(sql, [id]);
      return result[0];
    } catch (err) {
      throw new Error("DB Error", { cause: err });
    }
  },
  // 추천 축제 area_code로 찾기
  async areaRecommends(code, conn = pool) {
    try {
      const sql = `
      select
        id,
        event_start_date,
        event_end_date,
        title,
        first_image,
        over_view,
        home_page,
        datediff(event_end_date, now()) as d_day
      from festival_api
      where 
        rec is true and area_code= ?
        And datediff(event_end_date, now())>-1
      `;
      const [result] = await conn.query(sql, [code]);
      return result;
    } catch (err) {
      throw new Error("DB Error", { cause: err });
    }
  },
  // 추천 축제 리스트
  async recommends(code, conn = pool) {
    try {
      const sql = `
      select
        id,
        event_start_date,
        event_end_date,
        title,
        first_image,
        over_view,
        home_page,
        datediff(event_end_date, now()) as d_day,
        area_code
      from festival_api
      where 
        rec is true
        And datediff(event_end_date, now())>-1
      order by festival_api.event_end_date
      `;
      const [result] = await conn.query(sql, [code]);
      return result;
    } catch (err) {
      throw new Error("DB Error", { cause: err });
    }
  },
  // 해당 축제 추천하기
  async changeToRec(id, conn = pool) {
    try {
      const sql = `
      update festival_api set rec=if(rec=1,0,1) where id= ?;
        `;
      const [result] = await conn.query(sql, [id]);
      return result.affectedRows;
    } catch (err) {
      throw new Error("DB Error", { cause: err });
    }
  },
  // 축제 수정
  async updateFestival(id, article, conn = pool) {
    try {
      const sql = `
        update festival_api set ? where id = ?
      `;
      const [result] = await conn.query(sql, [article, id]);
      // console.log(result);
      return result.affectedRows;
    } catch (err) {
      throw new Error("DB Error", { cause: err });
    }
  },
};

module.exports = ExploreGetModel;
