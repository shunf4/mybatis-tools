const { rejects } = require('assert');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '192.168.182.128',
    port: 3316,
    user: 'root',
    password: '1234',
    database: 'web_chat'
});


let sql = 'SELECT c.TABLE_SCHEMA, c.TABLE_NAME, c.COLUMN_NAME, c.COLUMN_TYPE, t.TABLE_COMMENT, c.COLUMN_COMMENT'
    + ' FROM information_schema.COLUMNS c'
    + ' LEFT JOIN information_schema.tables t on t.TABLE_SCHEMA = c.TABLE_SCHEMA and t.table_name = c.TABLE_NAME'
    + ' WHERE c.TABLE_SCHEMA=? AND c.TABLE_NAME=?'
    + ' order by c.ordinal_position';


new Promise((resolve) => {
    connection.query({
        sql: sql,
        timeout: 40000,
        values: ['web_chat', 'user_info']
    }, function (error, results, fields) {
        if (error) { throw error; }
        console.log('connected', results, fields);
        resolve();
    });
}).then(() => {
    console.log('query end ===============');
});

console.log('=============================');
