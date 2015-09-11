var express = require('express');
var mysql = require('mysql');
var crypto = require('crypto');
var md5 = crypto.createHash('md5');
var router = express.Router();
var setting = require('../setting');

//登陆并返回回话sid
router.get('/server/login', function(req,res){
    var username = req.query['username'];
    var password = req.query['password'];
    var resopnd = {};

    if(username==undefined) {
        resopnd.success = false;
        resopnd.reason = 'noUsername';
        res.json(resopnd);
        return;
    }
    if(password==undefined){
        resopnd.success = false;
        resopnd.reason = 'noPassword';
        res.json(resopnd);
        return;
    }
    var temp = setting.query(
        'SELECT id FROM user where u_name=' + setting.xdecodeURI(username) + ' AND u_password=' +setting.xdecodeURI(password),
        function selectCb(err, results) {
            if (err) {
                throw err;
            }
            if(results=='') {
                resopnd.success = false;
                resopnd.reason = 'userOrPasswordError';
                res.json(resopnd);
                return;
            }
            resopnd.success = true;
            crypto.randomBytes(32, function (err, salt) {
                if (err) { throw err;}
                salt = salt.toString('hex');
                setting.query('UPDATE user SET login_token='+setting.xdecodeURI(salt)+'WHERE u_name='+setting.xdecodeURI(username),
                    function(err, results){
                        if (err) {
                            throw err;
                        }
                        resopnd.payload = salt;
                        res.json(resopnd);
                        return;
                });
            });
            return;
        });
});


//退出
router.get('/server/logout', function(req,res){
    if(req.cookies.username!=undefined && req.cookies.login_token!=undefined) {

        var query = setting.query('SELECT login_token FROM user WHERE u_name='+setting.xdecodeURI(req.cookies.username),
            function selectCb(err, results) {
                if (err) {
                    throw err;
                }
                if(results!=[]) {
                    if(results[0].login_token==req.cookies.login_token){

                        setting.query('UPDATE user SET login_token=NULL WHERE u_name='+setting.xdecodeURI(req.cookies.username),
                            function(err, results){
                                if (err) {
                                    throw err;
                                }
                                res.json({'success':true});
                                return;
                            });
                    }
                    else
                    {
                        res.json({'success':true,'errorMessage':'会话已过期'});
                    }
                }
                else
                {
                    res.json({'success':true,'errorMessage':'会话已过期'});
                }
            });
    }
    else{
        res.json({'success':false,'errorMessage':'noLogin'});
        return;
    }
});


router.get('/server/users', function(req, res) {

    setting.query(
      'SELECT id,u_name FROM user LIMIT 0,5',
      function selectCb(err, results) {
        if (err) {
          throw err;
        }
        res.send(results);
      });
  //db.end();
});

module.exports = router;
