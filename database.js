const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const _createPool = () => {
    return mysql.createPool({
        host: 'localhost',
        user: 'root',
        database: 'student_database',
        port: 3306,
        password: '12345678',
    });
}

app.get('/students', (req, res) => {
    try{
        const pool = _createPool();
        pool.getConnection(function (err, connection) {
            if (err instanceof Error) {
                console.log(err);
                return res.status(500).send("internal error");
            }
            let values = new Array();
            connection.query(
                'SELECT * from students', 
                values, 
                (err, rows, fields) => {
                    if (err) return res.status(500).send("internal error");
                    res.json(rows);
                }
            ); 
            
            connection.release();
        });
    }catch(_){
        res.status(500).send("internal error");
    }
});

app.get('/students/:id', (req, res) => {
    try{
        if(req.params.id && Number(req.params.id)){
            let values = new Array();
            values.push(req.params.id);
            
            const pool = _createPool();
            pool.getConnection(function (err, connection) {
                if (err instanceof Error) {
                    return res.status(500).send("internal error");
                }
                
                connection.query(
                    'SELECT * from students WHERE `id` = ?', 
                    values, 
                    (err, rows, fields) => {
                        if (err) return res.status(500).send("internal error");
                        res.json(rows);
                    }
                );
                
                connection.release();
            });
        }else{
            res.status(400).send("Bad Request");
        }
    }catch(_){
        res.status(500).send("internal error");
    }
});

app.delete('/students/:id', (req, res) => {
    try{
        if(req.params.id && Number(req.params.id)){
            let values = new Array();
            values.push(req.params.id);
            
            const pool = _createPool();
            pool.getConnection(function (err, connection) {
                if (err instanceof Error) {
                    return res.status(500).send("internal error");
                }

                connection.execute('DELETE FROM `students` WHERE `id` = ?', values, (err, result, fields) => {
                    if (err instanceof Error) {
                      console.log(err);
                      return res.status(500).send("internal error");
                    }
                  
                    console.log(result);
                    console.log(fields);
                    return res.send(`DELETE studensts ID = ${req.params.id} Successful`);
                });
                
                connection.release();
            });
        }else{
            res.status(400).send("Bad Request");
        }
    }catch(_){
        res.status(500).send("internal error");
    }
});

app.put('/students/:id', (req, res) => {
    try{
        if(req.params.id && Number(req.params.id)){
            let values = new Array();
            let where = new Array();
            let newDataSet = '';
            let newDataSetValue = new Array();

            if(req.body?.name){
                newDataSet += 'name = ?, ';
                newDataSetValue.push(req.body.name);
            }

            if(req.body?.age && Number(req.body?.age)){
                newDataSet += 'age = ?';
                newDataSetValue.push(req.body.age);
            }
            
            where.push(req.params.id);

            values = [].concat(newDataSetValue, where);

            const pool = _createPool();
            pool.getConnection(function (err, connection) {
                if (err instanceof Error) {
                    return res.status(500).send("internal error");
                }

                connection.query(`UPDATE students SET ${newDataSet} WHERE id = ?`, values, (err, result, fields) => {
                    if (err instanceof Error) {
                      console.log(err);
                      return res.status(500).send("internal error");
                    }
                  
                    console.log(result);
                    console.log(fields);
                    return res.send(`Update studensts ID = ${req.params.id} Successful`);
                });
                
                connection.release();
            });
        }else{
            res.status(400).send("Bad Request");
        }
    }catch(_){
        res.status(500).send("internal error");
    }
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/students.html");
});

app.post('/students', (req, res) => {
    try{
        const id = req.body?.id;
        const name = req.body?.name;
        const age = req.body?.age;
        const phone = req.body?.phone;
        const email = req.body?.email;

        if(id && Number(id) && name && age && Number(age) && phone && email){
            const pool = _createPool();
            pool.getConnection(function (err, connection) {
                if (err instanceof Error) {
                    return res.status(500).send("internal error");
                }

                let values = new Array();
                values.push(id);
                values.push(name);
                values.push(age);
                values.push(phone);
                values.push(email);

                connection.execute(`INSERT into students (id, name, age, phone, email) VALUES (?, ?, ?, ?, ?)`, values, (err, result, fields) => {
                    if (err instanceof Error) {
                      console.log(err);
                      return res.status(500).send("internal error");
                    }
                  
                    console.log(result);
                    console.log(fields);
                    return res.send(`INSERT studensts Successful`);
                });
                
                connection.release();
            });
        }else{
            res.status(400).send("Bad Request");
        }
    }catch(_){
        res.status(500).send("internal error");
    }
});

app.listen(3000, () => {
    console.log('server started on port 3000!');
});
   