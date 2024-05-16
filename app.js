
const express = require('express');
const mysql = require('mysql2');
const app = express();

app.get('/students', (req, res) => {
 /* const connection = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: '12345678',
   database: 'student_database',
 });

 // เปิด connection ไปที่ database
 connection.connect();

 connection.query('SELECT * from students', (err, rows, fields) => {
   if (err) throw err;

   // return response กลับไปหา client โดยแปลง record เป็น json array
   res.json(rows);
 });

 // ปิด connection
 connection.end(); */
 try{
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        database: 'student_database',
        port: 3306,
        password: '12345678',
    });
    
        pool.getConnection(function (err, connection) {
            if (err instanceof Error) {
                console.log(err);
                return;
            }
            let values = new Array();
            const idList = [9,10];
            values.push([idList]);
            connection.query(
                'SELECT * from students where `id` IN ?', 
                values, 
                (err, rows, fields) => {
                    if (err) return res.status(500).send("internal error");;
                
                    // return response กลับไปหา client โดยแปลง record เป็น json array
                    res.json(rows);
                }
            ); 
            
            connection.release();
        });
    }catch(_){
        res.status(500).send("internal error");
    }
});

app.listen(3000, () => {
 console.log('server started on port 3000!');
});
