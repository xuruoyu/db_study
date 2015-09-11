/**
 * Created by xuruoyu on 15/9/3.
 */
/**
 *MySQL Model
 **/

var mq = require("mysql");
var async = require('async');
var setting = require('./setting');



var query_one = function(id, tableName, column, idColumnName, callback){
    var sql = 'SELECT * FROM ' + tableName;

    if(column == null)
        sql = 'SELECT * FROM ' + tableName;
    else {
        sql = 'SELECT '
        for(index in column)
        {
            sql = sql + column[index];
            if(index != column.length-1)
                sql = sql + ',';
        }
        sql = sql + ' FROM ' + tableName;
    }

    sql = sql + ' WHERE '+ idColumnName+ '=' + id;

    var query = setting.query(sql, function(err, result) {
        if (err) {
            callback(err,result);
        }else{
            callback(result[0]);
        }
    });
};

module.exports.query_one = query_one;

var count = function(tableName, callback){
    var query = setting.query("select count(*) as count from " + tableName, function(err, result) {

        if (err) {
            callback(err,result);
        }else{
            //console.log(tableName,result[0].count);
            callback(result[0].count);
        }
    });
    //console.log(query.sql);
};
module.exports.count = count;

var queryPage = function(tableName, page, size, column, froegin, callback){
    var count = 0;
    if(tableName == undefined){
        console.log('count:tableName undefined');
        return;
    }
    var sql = 'SELECT * FROM ' + tableName;
    if(column == null || column == '')
        sql = 'SELECT * FROM ' + tableName;
    else {
        sql = 'SELECT '
        for(var index in column)
        {
            sql = sql + column[index];
            if(index != column.length-1)
                sql = sql + ',';
        }
        sql = sql + ' FROM ' + tableName;
    }
    this.count(tableName,function(count){
        var totalPage = Math.ceil(count / size);
        sql = sql + ' LIMIT ' + page*size +',' + size;
        if(page>totalPage)
        {
            callback(false);
            return;
        }

        //总页数异常
        if(totalPage == Infinity)
            totalPage = 0;
        var query = setting.query(sql,function(err,results){
            if (err) {
                console.error('page : ' + err.stack);
                return;
            }else{
                var content = results;
                if(froegin != null && froegin != undefined && froegin != {}){
                    var con_;
                    for(var index in column){
                        if(froegin.condition == column[index]){
                            con_ = true;
                        }
                    }
                    if(!con_){
                        console.log(froegin.condition +' not in column');
                        return;
                    }
                    var sql_froegin = 'SELECT ';
                    if(froegin.cloumn == null || froegin.cloumn == undefined)
                        sql_froegin = 'SELECT * FROM ' + froegin.table_name;
                    else {
                        sql_froegin = 'SELECT ';
                        for(var index in froegin.cloumn)
                        {
                            sql_froegin = sql_froegin + froegin.cloumn[index];
                            if(index != froegin.cloumn.length-1)
                                sql_froegin = sql_froegin + ',';
                        }
                        sql_froegin = sql_froegin + ' FROM ' + froegin.table_name;
                    }
                    sql_froegin = sql_froegin + ' WHERE ' + froegin.condition + '=';
                    //console.log(eval('content[' + '].' + froegin.condition));
                    var temp = [];
                    for(var index = 0;index < content.length;index++){
                        temp[index] = {
                            condition :Number,
                            name : Number,
                            sql : String
                        }
                        temp[index].name = eval('content[' + index.toString() + '].' + froegin.name);
                        temp[index].condition = eval('content[' + index.toString() + '].' + froegin.condition);
                        if(froegin.condition != null)
                            temp[index].sql = sql_froegin + temp[index].condition;
                    }
                    /**
                     * 所有操作并发执行，且全部未出错，最终得到的err为undefined。注意最终callback只有一个参数err。
                     **/
                    index = 0;
                    //console.log(temp);
                    async.eachSeries(temp, function(item, callback) {
                        setting.query(item.sql, function(err, eachResult){
                            eval("content[index]."+froegin.table_name+'={};');
                            eval("content[index]."+froegin.table_name+'=eachResult[0];');
                            index++;
                            callback(err,eachResult);
                        });
                    }, function(err) {
                        callback(true,content,count,totalPage);
                    });

                }
                else{
                    callback(true,results,count,totalPage);
                }
            }
        });
    });
};
module.exports.queryPage = queryPage;

//分页查询公用方法
var getPageFromUrl = function(req, res, tableName, column, froegin, callback){
    //console.log(froegin);
    //console.log(column);
    var req_page = req.query['page'];
    var req_size = req.query['size'];
    //console.log(isNaN(req_page),isNaN(req_size));
    if(isNaN(req_page)) {
        callback({'success':false,'errorMessage':'page is not number'});
        return false;
    }
    if(isNaN(req_size)) {
        callback({'success':false,'errorMessage':'size is not number'});
        return false;
    }
    var resopnd = {};

    if(req_page==undefined) {
        resopnd.success = false;
        resopnd.errorMessage = 'noPage';
        callback(resopnd);
        return false;
    }
    if(req_size==undefined){
        resopnd.success = false;
        resopnd.errorMessage = 'noSize';
        callback(resopnd);
        return false;
    }
    this.queryPage(tableName, req_page, req_size, column, froegin, function(success,results,count,totalPages){
        //console.log('results:',results);
        var numberOfElements = parseInt(0);
        var number = parseInt(req_page);
        var responds = {
            'success' : true,
            'payload' : {
                'content' : [],
                'first' : false,
                'last' : true,
                'number' : number,
                'numberOfElements' : numberOfElements,
                'totalPages' : totalPages,
                'totalElements' : count
            }
        };
        if(results == '' || results == undefined) {
            callback(responds);
            return;
        }
        else{
            responds.payload.content = results;
            if(results.length != undefined)
                responds.payload.numberOfElements = results.length;
            if(number == 0)
                responds.payload.first = true;
            if(number < totalPages-1)
                responds.payload.last = false;
            callback(responds);
        }
    });
};
module.exports.getPageFromUrl = getPageFromUrl;

//插入或更新一条纪录
var postOneRecord = function(tableName, isInsert, content, whereCondition, callback){
    if(isInsert){
        //console.log(content);
        //console.log(whereCondition);
        var sql = 'INSERT INTO ' + decodeURI(tableName) + ' (';

        for(var index in content){
            sql = sql + decodeURI(content[index].name);
            if(index!=content.length-1)
                sql = sql + ',';
        }
        sql = sql + ') VALUES(';

        for(var index in content){
            sql = sql + setting.xdecodeURI(content[index].value);
            if(index!=content.length-1)
                sql = sql + ',';
        }
        sql = sql + ')';
        //console.log('sql:',sql);
        setting.query(sql,function(err,results){
            if (err) {
                //console.error('INSERT : ' + err.stack);
                callback(err);
                return;
            }else{
                //console.log(results);
                callback(err,results);
            }
        });
    }
    else if(!isInsert){

        if(whereCondition == undefined)
            callback({success:false,errorMessage:'没有where条件'});
        else{
            var sql_update = 'UPDATE ' + setting.xdecodeURI(tableName,false) + 'SET';
            for(var index in content){
                sql_update = sql_update + setting.xdecodeURI(content[index].name,false) + '=';
                sql_update = sql_update + setting.xdecodeURI(content[index].value);
                if(index!=content.length-1)
                    sql_update = sql_update + ',';
            }
            sql_update = sql_update + 'WHERE ' + setting.xdecodeURI(whereCondition.name,false);
            sql_update = sql_update + '=' + setting.xdecodeURI(whereCondition.column);
            //console.log(sql_update);
            setting.query(sql_update,function(err,results){
                if (err) {
                    //console.error('INSERT : ' + err.stack);
                    callback(err);
                }else{
                    //console.log(results);
                    callback(err,results);
                }
            });
        }
    }
    else{
        callback({error:'插入或更新错误!'});
    }
};
module.exports.postOneRecord = postOneRecord;