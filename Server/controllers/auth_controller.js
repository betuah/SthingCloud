const bcrypt                = require('bcryptjs');
const jwt                   = require('jsonwebtoken');
const env                   = require('../env');
const authModel             = require('../models/mysql/crud_model');

exports.signIn = async (req, res) => {
    try {
        const username      = req.query.username ? req.query.username : (req.body.username ? req.body.username : req.params.username);
        const password      = req.query.password ? req.query.password : (req.body.password ? req.body.password : req.params.password);
        const tb            = "v_user_roles";

        if (username && password) {
            const data = {
                table: tb,
                condition: `WHERE email="${username}" or id_users="${username}"`
            }

            authModel.findCondition(data, async (err, result) => {                
                if(err) {
                    const error = {
                        status: "Error",
                        code: "500",
                        msg: "Internal Server Error!"
                    }
                    res.status(500).json(error);
                } else {
                    if (result.data) {                        
                        const id            = result.data.id_users;
                        const role          = result.data.id_roles;
                        const existPassword = result.data.password;
                        const isTrueHashed  = await bcrypt.compare(password, existPassword);

                        if(isTrueHashed === true) {
                            const secret    = env.token_secret;
                            const token     = jwt.sign({ _id: `${id}`, _roles: `${role}`}, secret, { expiresIn: '2h' });
                            const userData  = {
                                status: result.status,
                                code: result.code,
                                token: token,
                                data: {
                                    id: result.data.id_users,
                                    name: result.data.name,
                                    email: result.data.email
                                }
                            }
                            res.status(200).json(userData);
                        } else {
                            const err = {
                                status: "Error",
                                code: "400",
                                msg: "Invalid Username or password!"
                            }
                            res.status(400).json(err);
                        }
                    } else {
                        const err = {
                            status: "Error",
                            code: "400",
                            msg: "Your email or username not found!"
                        }
                        res.status(400).json(err);
                    }
                }
            }); 
        } else {
            const err = {
                STATUS: "Error",
                CODE: "501",
                MSG: "Post Data required!",
                POST_DATA_REQUIREMENT: {
                    username: {
                        type: 'text',
                        required: 'true',
                        unique: 'true',
                        data_type: 'varchar(50)'
                    },
                    password: {
                        type: 'password',
                        required: 'true',
                        unique: 'false',
                        data_type: 'varchar(50)'
                    }
                }

            }
            res.status(400).json(err);
        }

           
    } catch (error) {
        res.status(500).send();
    }
    
}

exports.signUp = async (req, res) => {
    try {
        // const id                = uuid.generate();
        const id                = req.body.username; // User username as ID
        const name              = req.body.name;
        const email             = req.body.email;
        const password          = req.body.password;
        const passwordHashed    = await bcrypt.hash(password, 8);

        const val = `"${id}","${name}","${email}","${passwordHashed}","2"`;

        const check_data = {
            table: 'tb_users',
            condition: `WHERE email="${email}" or id_users="${id}"`
        }

        authModel.findCondition(check_data, async (err, result) => {
            if(err) {
                const error = {
                    status: "Error",
                    code: "400",
                    msg: "Username or email already exist!"
                }
                res.status(400).json(error);
            } else {
                const data = {
                    table: 'tb_users',
                    column: 'id_users, name, email, password, id_roles',
                    values: val
                }
        
                authModel.insert(data, (err, result) => {
                    if(err) {
                        res.status(500).json(err);
                    } else {            
                        res.status(200).json(result);                      
                    }
                });
            }
        });       
    } catch (error) {
        console.log(error);
        const data = {
            status: 'ERROR',
            code: 400,
            msg: 'Data Required!',
            POST_DATA_REQUIREMENT: {
                username: {
                    type: 'text',
                    required: 'true',
                    unique: 'true',
                    data_type: 'varchar(50)'
                },
                name: {
                    type: 'text',
                    required: 'true',
                    unique: 'true',
                    data_type: 'varchar(50)'
                },
                email: {
                    type: 'email',
                    required: 'true',
                    unique: 'true',
                    data_type: 'varchar(50)'
                },
                password: {
                    type: 'password',
                    required: 'true',
                    unique: 'false',
                    data_type: 'varchar(50)'
                }
            }
        }
        res.status(400).json(data);
    }
    
};

exports.profile = async (req, res) => {
    const id_val    = req.id_user;
    const tb        = "v_users";

    const data = {
        table: tb,
        column: 'id_users',
        values: id_val
    }
    
    authModel.findOne(data, (err, result) => {
        if(err) {
            res.status(500).json(err);
        } else {
            if(result.data === null) {
                const dataRes = {
                status: result.status,
                code: result.code,
                msg: result.msg
                }
                res.status(result.code).json(dataRes);
            } else {
                res.status(200).json(result);
            }            
        }
    });    
};
