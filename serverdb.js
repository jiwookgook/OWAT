const http = require('http'); 
const express = require('express');
const mariadb = require('mariadb');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');


// 데이터베이스 연결 풀 생성
const pool = mariadb.createPool({
    host: 'localhost',
    port: 4406,
    user: 'root',
    password: 'admin',
    database: 'test',
    connectionLimit: 10,
    debug: false
});

const app = express(); // Express 애플리케이션 생성
app.use(cors());

// 폴더 오픈하기
app.use('/', express.static(path.join(__dirname)));

// Body-parser 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router = express.Router();
app.use('/', router);

BigInt.prototype.toJSON = function() {
    return this.toString();
};

// 추가 요청
router.route('/person/add').post(async (req, res) => { // POST 요청 메소드
    console.log('/person/add 요청됨.');

    //요청파라미터 확인하기
    const params = req.body;
    console.log(`params -> ${JSON.stringify(params)}`);

    let conn; // finally 블록에서도 사용하기 위해 외부에 선언
    try {
        conn = await pool.getConnection();

        const sql = `INSERT INTO test.person (id, password, confirmpassword, email)
                     VALUES (?, ?, ?, ?)`;
        const rows = await conn.query(sql, [params.new_uid, params.new_upw, params.confirm_upw, params.email]);
        console.log(`SQL 실행 결과: ${JSON.stringify(rows)}`);

        const output = {
            code: 200,
            message: 'OK',
            header: {},
            data: rows
        };
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf8' });
        res.end(JSON.stringify(output)); // JSON 문자열로 변환하여 응답

    } catch (err) {
        console.error(`에러 발생: ${err}`);

        const output = {
            code: 400,
            message: `에러 발생: ${err}`,
        };

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf8' });
        res.end(JSON.stringify(output));

    } finally {
        if (conn) { conn.end(); } // 연결 종료
    }
});

// 서버 시작
const server = http.createServer(app);
server.listen(7001, () => {
    console.log('서버가 http://localhost:7001 에서 실행 중입니다.');
});