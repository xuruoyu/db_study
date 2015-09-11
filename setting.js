/**
 * Created by xuruoyu on 15/9/1.
 **/

var mysql = require('mysql');

//数据库连接设置
var db_conn = {
    host     : 'dbteststudy.mysql.rds.aliyuncs.com',
    user     : 'xuruoyu',
    password : '123456',
    database : 'db_test',
    dateStrings: true
    //debug : true
};

//尽量少用这个函数,以免数据库连接爆炸!!!!
var databaseConn =function(){
    var conn = mysql.createPool(db_conn);
    conn.getConnection(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
    });
    return conn;
};
module.exports.databaseConn = databaseConn;

//使用连接池
var pool = mysql.createPool(db_conn);
var query = function(sql, callback){
    pool.getConnection(function(err,conn){
        if(err){
            callback(err,null,null);
        }else{
            conn.query(sql,function(qerr,vals,fields){
                //console.log(this.sql);
                //释放连接
                conn.release();
                //事件驱动回调
                callback(qerr,vals,fields);
            });

        }
    });
};
module.exports.query = query;

//重写过滤函数
var xdecodeURI = function(string, quotation){
    if(string.indexOf("'")>0){
        console.log('xdecodeURI:字符串非法');
        string = ' ';
    }
    if(quotation==undefined)
        return " '"+decodeURI(string)+"' ";
    if(quotation==false)
        return " "+decodeURI(string)+" ";
    return decodeURI(string);
}
module.exports.xdecodeURI = xdecodeURI;

//分页处理
var page ={
    'success' : true,
    'payload' : {
        'content' : [],
        'first' : true,
        'last' : false,
        'number' : Number,
        'totalPages' : Number,
        'totalElements' : Number
    }
};
module.exports.page = page;
