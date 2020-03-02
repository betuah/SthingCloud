var connection = require('../../config/db_mysql');

exports.findAll = (data, result) => {
    /*
        const data = {
            table: "table name"
        }
    */

    connection.query(`SELECT * FROM ${data.table}`, (error, rows, fields) => {
        if(error){
            const err = {
                status: "Error",
                code: "500",
                msg: "Error find data"
            }
            console.log(error);
            result(err, null);
        } else{
            let status  = null;
            let msg     = null;

            if(rows.length > 0) {
                status  = "Success!";
                code    = 201;
                msg     = "Data found!" ;
                data    = rows;
            } else {
                status  = "Error!";
                code    = 404;
                msg     = "Data not found!" ;
                data    = null;
            }

            const success = {
                status: status,
                code: code,
                msg: msg,
                data: data
            }

            result(null, success);
        }
    });
};

exports.findOne = (data, result) => {

    /*
        const data = {
            table: "Table name",
            column: 'Your column name',
            values: 'Data values'
        }
    */

    connection.query(`SELECT * FROM ${data.table} where ${data.column} = "${data.values}"`, (error, rows, fields) => {
        if(error){
            const err = {
                status: "Error",
                code: "500",
                msg: "Server Error"
            }
            console.log(error);
            result(err, null);
        } else{
            let status  = null;
            let msg     = null;
            let code    = null;
            let data    = null;

            if(rows.length > 0) {
                status  = "Success!";
                code    = 201;
                msg     = "Data found!" ;
                data    = rows[0];
            } else {
                status  = "Error!";
                code    = 404;
                msg     = "Data not found!" ;
                data    = null;
            }

            const success = {
                status: status,
                code: code,
                msg: msg,
                data: data
            }

            result(null, success);
        }
    });
};

exports.findCondition = (data, result) => {

    /*
        const data = {
            table: "Table name",
            condition: "Where conditions"
        }
    */

    connection.query(`SELECT * FROM ${data.table} ${data.condition}`, (error, rows, fields) => {
        if(error){
            const err = {
                status: "Error",
                code: "500",
                msg: "Server Error"
            }
            console.log(error);
            result(err, null);
        } else{
            let status  = null;
            let msg     = null;

            if(rows.length > 0) {
                status  = "Success!";
                code    = 200;
                msg     = "Data found!" ;
                data    = rows[0];

                const success = {
                    status: status,
                    code: code,
                    msg: msg,
                    data: data
                }
    
                result(null, success);
            } else {
                status  = "Error!";
                code    = 404;
                msg     = "Data not found!" ;
                data    = null;

                const err = {
                    status: status,
                    code: code,
                    msg: msg,
                    data: data
                }
    
                result(err, null);
            }            
        }
    });
};

exports.insert = (data, result) => {
    /*
        const data = {
            table: 'Your table',
            column: 'Your table column',
            values: 'Your column values'
        }
    */

    connection.query(`INSERT INTO ${data.table} (${data.column}) values (${data.values})`, (error, rows, fields) => {
        if(error){
            const err = {
                status: error.code,
                code: "500",
                msg: error.sqlMessage
            }
            console.log(error);
            result(err, null);
        } else{
            const success = {
                status: "Success!",
                code: 201,
                msg: "Success insert data!"
            }

            result(null, success);
        }
    });
};

exports.update = (data, result) => {
    /*
        const data = {
            table: "Table name",
            set: "Set column and value",
            condition: "Where conditions"
        }
    */

    connection.query(`UPDATE ${data.table} SET ${data.set} ${data.condition}`, (error, rows, fields) => {
        if(error){
            const err = {
                status: error.code,
                code: "500",
                msg: error.sqlMessage
            }
            console.log(error);
            result(err, null);
        } else{
            const success = {
                status: 'Updated!',
                code: "200",
                msg: 'Success update data!'
            }
            result(null, success);
        }
    })
}