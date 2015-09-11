/**
 * Created by xuruoyu on 15/9/1.
 */

var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var setting = require('../setting');
var myQuery = require('../mysql_query');

//登陆拦截
router.use(function (req, res, next) {
    if(req.cookies.username!=undefined && req.cookies.login_token!=undefined) {

        setting.query('SELECT login_token FROM user WHERE u_name='+setting.xdecodeURI(req.cookies.username),
            function selectCb(err, results, fields) {
                if (err) {
                    throw err;
                }
                if(results != '') {
                    if(results[0].login_token!=req.cookies.login_token){
                        var err = new Error('401 需要重新登陆');
                        err.status = 401;
                        next(err);
                        return true;
                    }
                    else
                    {
                        next();
                        return false;
                    }
                }
                else{
                    var err = new Error('401 需要重新登陆');
                    err.status = 401;
                    next(err);
                    return true;
                }
            });
    }
    else{
        var err = new Error('403 Forbidden');
        err.status = 403;
        next(err);
    }
});



//比赛列表
router.get('/server/competition',function(req, res){
    myQuery.getPageFromUrl(req, res, 'competition', null, null, function(results){
        res.json(results);
    });
});

//运动员列表
router.get('/server/athlete',function(req, res){
    //查询字段
    //1.不使用视图
    //var column = ['id', 'name', 'nick_name', 'gender', 'mobile', 'birthday', 'athlete_group_id', 'group_name'];
    //2.使用视图
    var column = ['id', 'name', 'nick_name', 'gender', 'mobile', 'birthday', 'athlete_group_id'];
    var froegin = {};
    froegin.name = 'athlete_group_id' ;
    froegin.table_name = 'athlete_group';
    froegin.cloumn = ['name', 'description'];
    froegin.condition = 'id';
    myQuery.getPageFromUrl(req, res, 'athlete', column, froegin, function(results){
        res.json(results);
    });
});

//参赛团体列表
router.get('/server/athlete_group',function(req, res){
    myQuery.getPageFromUrl(req, res, 'athlete_group', null, null, function(results){
        res.json(results);
    });
});

router.get('/server/test',function(req, res){
    var test = {'test' : 'test','test2':'test2'};
    delete test.test;
    res.json(test);
});

//添加运动员信息
router.post('/server/athlete',function(req,res){
    var content = [];
    var count = 0;

    //name
    if(req.body.name != undefined){
        content[count] = {
            name : 'name',
            value : req.body.name
        }
        count++;
    }else{
        res.json({'success':false,'errorMessage':'无name传入'})
    }
    //gender
    if(req.body.gender != undefined){
        content[count] = {
            name : 'gender',
            value : req.body.gender
        }
        count++;
    }else{
        res.json({'success':false,'errorMessage':'无gender传入'})
    }

    content[count] = {
        name : 'birthday',
        value : req.body.birthday
    };
    count++;
    content[count] = {
        name : 'mobile',
        value : req.body.mobile
    };
    count++;

    content[count] = {
        name : 'nick_name',
        value : req.body.nick_name
    };
    count++;

    myQuery.postOneRecord('athlete', true, content, null, function(err,results){
        //console.log(err,results);
        if(err!=null){
            if(err.errno==1062)
                res.json({success:false,errorMessage:'运动员名称重复!'});
        }
        else{
            res.json({success:true});
        }
    });
});

//添加运动员信息
router.put('/server/athlete/:id',function(req,res){
    var content = [];
    var count = 0;

    //name
    if(req.body.name != undefined){
        content[count] = {
            name : 'name',
            value : req.body.name
        }
        count++;
    }else{
        res.json({'success':false,'errorMessage':'无name传入'})
    }
    //gender
    if(req.body.gender != undefined){
        content[count] = {
            name : 'gender',
            value : req.body.gender
        }
        count++;
    }else{
        res.json({'success':false,'errorMessage':'无gender传入'})
    }

    content[count] = {
        name : 'birthday',
        value : req.body.birthday
    };
    count++;
    content[count] = {
        name : 'mobile',
        value : req.body.mobile
    };
    count++;

    content[count] = {
        name : 'nick_name',
        value : req.body.nick_name
    };
    count++;

    //条件
    var whereCondition = {
        'name' : 'id',
        'column' : req.params.id
    }

    myQuery.postOneRecord('athlete', false, content, whereCondition, function(err,results){
        //console.log(err,results);
        if(err!=null){
            if(err.errno==1062)
                res.json({success:false,errorMessage:'运动员名称重复!'});
        }
        else{
            res.json({success:true});
        }
    });

});

//添加比赛信息
router.post('/server/competition',function(req,res){
    var content = [];
    var count = 0;
    //name
    if(req.body.name != undefined){
        content[count] = {
            name : 'name',
            value : req.body.name
        }
        count++;
    }else{
        res.json({'success':false,'errorMessage':'无name传入'})
    }
    //name
    if(req.body.name != undefined){
        content[count] = {
            name : 'description',
            value : req.body.description
        }
        count++;
    }else{
        res.json({'success':false,'errorMessage':'无name传入'})
    }
    //console.log(content);
    myQuery.postOneRecord('competition', true, content, null, function(err,results){
        //console.log(err,results);
        if(err!=null){
            if(err.errno==1062)
                res.json({success:false,errorMessage:'比赛名称重复!'});
        }
        else{
            res.json({success:true});
        }
    });
});

//修改比赛信息
router.put('/server/competition/:id',function(req,res){
    var content = [];
    var count = 0;
    //name
    if(req.body.name != undefined){
        content[count] = {
            name : 'name',
            value : req.body.name
        }
        count++;
    }else{
        res.json({'success':false,'errorMessage':'无name传入'})
    }
    //name
    if(req.body.name != undefined){
        content[count] = {
            name : 'description',
            value : req.body.description
        }
        count++;
    }else{
        res.json({'success':false,'errorMessage':'无name传入'})
    }

    //条件
    var whereCondition = {
        'name' : 'id',
        'column' : req.params.id
    }

    myQuery.postOneRecord('competition', false, content, whereCondition, function(err,results){
        //console.log(err,results);
        if(err!=null){
            if(err.errno==1062)
                res.json({success:false,errorMessage:'比赛名称重复!'});
        }
        else{
            res.json({success:true});
        }
    });
});


module.exports = router;