var app = angular.module("xjConsoleApp", ["ngRoute", "ngTouch", "mobile-angular-ui", "textAngular", "ngFileUpload", "chart.js", "angucomplete-alt", "xxService", "xxDirective", "xxFilter"]);


var appRouteConfig = ["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
    $routeProvider.when("/", {
        controller: homeCtlr,
        templateUrl: "views/home.html"
    }).when("/login", {
        controller: loginCtlr,
        templateUrl: "views/login.html",
        auth: false
    }).when("/consult/consult_list", {
        controller: consultListCtlr,
        templateUrl: "views/consult/consult_list.html"
    }).when("/cnslr/counselor_list", {
        controller: cnslrListCtlr,
        templateUrl: "views/cnslr/counselor_list.html"
    }).when("/consult/OperationRrecords", {
        controller: consultOperCtlr,
        templateUrl: "views/sys/operation_records.html"
    }).when("/cnslr/counselor_online_list", {
        controller: cnslrOnlineListCtlr,
        templateUrl: "views/cnslr/counselor_online_list.html"
    }).when("/cnslr/counselor_online_info/:counselor_id", {
        controller: cnslrOnlineInfoCtlr,
        templateUrl: "views/cnslr/counselor_online_info.html"
    }).when("/cnslr/counselor_apply_list", {
        controller: cnslrApplyListCtlr,
        templateUrl: "views/cnslr/counselor_apply_list.html"
    }).when("/cnslr/withdraw_list", {
        controller: withdrawListCtlr,
        templateUrl: "views/cnslr/withdraw_list.html"
    }).when("/consult_organization/consult_organization_list", {
        controller: cnsorgListCtlr,
        templateUrl: "views/consult_organization/consult_organization_list.html"
    }).when("/cnslr/counselor_handnote", {
        controller: cnslrNoteCtlr,
        templateUrl: "views//cnslr/counselor_handnote.html"
    }).when("/coupon/coupon_list", {
        controller: couponListCtlr,
        templateUrl: "views/coupon/coupon_list.html"
    }).when("/sys/staff_list", {
        controller: staffListCtlr,
        templateUrl: "views/sys/staff_list.html"
    }).when("/sys/role_list", {
        controller: roleListCtlr,
        templateUrl: "views/sys/role_list.html"
    }).when("/change_password", {
        controller: changePwdCtlr,
        templateUrl: "views/change_password.html"
    }).when("/stat/user_count", {
        controller: statUserCountCtlr,
        templateUrl: "views/stat/user_count.html"
    }).when("/stat/user_duration", {
        controller: statUserDurationCtlr,
        templateUrl: "views/stat/user_duration.html"
    }).when("/stat/user_time", {
        controller: statUserTimeCtlr,
        templateUrl: "views/stat/user_time.html"
    }).when("/stat/user_bill", {
        controller: statUserBillCtlr,
        templateUrl: "views/stat/user_bill.html"
    }).when("/user/user_list", {
        controller: userListCtlr,
        templateUrl: "views/user/user_list.html"
    }).when("/user/user_organzation", {
        controller: userOrgListCtlr,
        templateUrl: "views/user/user_organzation.html"
    }).otherwise({
        redirectTo: "/"
    });
    $locationProvider.html5Mode(true);
}];

app.config(appRouteConfig);

app.run(["$rootScope", "$location", "xxHttp", function ($rootScope, $location, xxHttp) {
	if(cookie.get("staff_token") != null) {
		xxHttp.get("/server/console/sys/no_auth/staff/current/role", null, function (payload) {
	        $rootScope.roles = payload;
	    });
	}
	
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        $rootScope.isStaffLogin = cookie.get("staff_token") != null;
        next.auth = next.auth == null ? true : next.auth;
        if (next.auth && !$rootScope.isStaffLogin) {
            $rootScope.login_back_path = window.location.pathname;
            $location.path("/login");
        }
    });

    $rootScope.laborClassMap = {
        FIRST: "一级",
        SECOND: "二级",
        THIRD: "三级"
    };

    $rootScope.cnslrStyleMap = {
        PUNGENT: "麻辣型",
        HEALING: "疗愈型",
        CALM: "冷静型",
        ADVANCED: "高级"
    };
}]);

app.controller("MainCtrl", ["$scope", "$location", "$timeout", "xxHttp", "xxContext", function ($scope, $location, $timeout, xxHttp, xxContext) {
    $scope.p_get_counselor = [{
        method: "GET",
        url: "/console/counselor"
    }];

    $scope.p_get_counselor_online_history = [{
        method: "GET",
        url: "/console/counselor/online_history"
    }];

    $scope.p_get_counselor_apply = [{
        method: "GET",
        url: "/console/counselor/apply"
    }];

    $scope.p_get_counselor_account_flow = [{
        method: "GET",
        url: "/console/counselor/account_flow"
    }];

    $scope.p_get_institution = [{
        method: "GET",
        url: "/console/partner/institution"
    }];

    $scope.p_get_note = [{
        method: "GET",
        url: "/console/counselor/note"
    }];

    $scope.p_get_staff = [{
        method: "GET",
        url: "/console/sys/staff"
    }];

    $scope.p_get_role = [{
        method: "GET",
        url: "/console/sys/role"
    }];

    $scope.p_get_user_total = [{
        method: "GET",
        url: "/console/statistic/user/total"
    }];

    $scope.p_get_user_balance_flow = [{
        method: "GET",
        url: "/console/statistic/user/balance_flow"
    }];

    $scope.p_get_session_time = [{
        method: "GET",
        url: "/console/statistic/session_time"
    }];

    $scope.p_get_session_count = [{
        method: "GET",
        url: "/console/statistic/session_count"
    }];

    $scope.p_get_consult_record = [{
        method: "GET",
        url: "/console/consult/record"
    }];

    $scope.p_get_cash_coupon_sales = [{
        method: "GET",
        url: "/console/market/cash_coupon_sales"
    }];

    $scope.p_get_op_log = [{
        method: "GET",
        url: "/console/sys/op_log"
    }];

    $scope.logout = function () {
        if (confirm("您确认要退出管理平台？")) {
            xxHttp.get("/server/console/anonymous/logout", null, function (payload) {
                cookie.remove("staff_token");
                $location.path("/login");
            });
        }
    };
}]);

/**
 * 首页
 */
var homeCtlr = ["$rootScope", "$scope", function ($rootScope, $scope) {
    $scope.p_get_counselor = [{
        method: "GET",
        url: "/console/counselor"
    }];

    $scope.p_get_counselor_apply = [{
        method: "GET",
        url: "/console/counselor/apply"
    }];

    $scope.p_get_staff = [{
        method: "GET",
        url: "/console/sys/staff"
    }];

    $scope.p_get_role = [{
        method: "GET",
        url: "/console/sys/role"
    }];

    $scope.p_get_consult_record = [{
        method: "GET",
        url: "/console/consult/record"
    }];

    $scope.p_get_counselor_account_flow = [{
        method: "GET",
        url: "/console/counselor/account_flow"
    }];
}];

/**
 * 登陆
 */
var loginCtlr = ["$rootScope", "$scope", "$location", "xxHttp", function ($rootScope, $scope, $location, xxHttp) {
    $scope.account = parseInt(localStorage["staff_account"]);
    $scope.password;
    $scope.rememberMe = true;

    $scope.login = function () {
        xxHttp.get("/server/console/anonymous/login", {
            params: {
                account: $scope.account,
                password: $scope.password
            }
        }, function (payload) {
            if ($scope.rememberMe) {
                localStorage.setItem("staff_account", $scope.account);
            } else {
                localStorage.removeItem("staff_account");
            }
            cookie.set("staff_token", payload, {
                path: "/"
            });
            xxHttp.get("/server/console/sys/no_auth/staff/current/role", null, function (payload) {
                $rootScope.roles = payload;
                $location.path($rootScope.login_back_path == null ? "/" : $rootScope.login_back_path).replace();
            });
        });
    };
}];

/**
 * 更改密码
 */
var changePwdCtlr = ["$scope", "$location", "xxHttp", function ($scope, $location, xxHttp) {
    $scope.oldPwd;
    $scope.newPwd;
    $scope.newPwdRpt;

    $scope.changePwd = function () {
        if ($scope.newPwd != $scope.newPwdRpt) {
            alert("两次新密码不一致");
            return;
        }
        xxHttp.put("/server/console/sys/no_auth/staff/password", null, {
            params: {
                old_pwd: $scope.oldPwd,
                new_pwd: $scope.newPwd
            }
        }, function (payload) {
            alert("密码修改成功!");
            $location.path("/");
        });
    };
}];

/**
 * 咨询记录列表
 */
var consultListCtlr = ["$rootScope", "$scope", "xxHttp", "xxPage", "SharedState", function ($rootScope, $scope, xxHttp, xxPage, SharedState) {
    $scope.selected = null;
    $scope.cur_record = {};
    $scope.cur_record_id;
    $scope.getlocaltime = function (calldate_s) {
        var minutes = 1000 * 60;
        var hours = minutes * 60;
        var localdate = new Date;
        var calldate = new Date(calldate_s);
        localdate.getTime();
        //console.log(e.id,localdate.getTime(),calldate.getTime(),(localdate.getTime()-calldate.getTime())/hours);
        if (((localdate.getTime() - calldate.getTime()) / hours) > 6)
            return true;
        else
            return false;
    };

    $scope.p_get_consult_record = [{
        method: "GET",
        url: "/console/consult/record"
    }];

    $scope.p_post_consult_manual_hangup = [{
        method: "POST",
        url: "/console/consult/*/manual_hangup"
    }];

    $scope.state = {
        CREATED: "已创建",
        DIALING: "通话中",
        DISCONNECT: "已挂断",
        FINISHED: "已完成",
        CANCELLED: "已取消"
    };

    $scope.input_states = {
        CREATED: true,
        DIALING: true,
        DISCONNECT: true,
        FINISHED: true,
        CANCELLED: true
    };

    var fetchFunc = function (page, size, callback) {
        xxHttp.get("/server/console/consult/record", {
            params: {
                keyword: $scope.param_keyword,
                states: $scope.param_states,
                page: page,
                size: size
            }
        }, callback);
    };

    $scope.reload = function () {
        $scope.param_keyword = $scope.input_keyword;
        $scope.param_states = [];
        // console.log($scope.input_states);
        for (var state in $scope.input_states) {
            // console.log(state);
            if ($scope.input_states[state]) {
                $scope.param_states[$scope.param_states.length] = state;
            }
        }
        $scope.param_states = $scope.param_states.join();
        $scope.selected = null;
        $scope.page = xxPage(fetchFunc, 50);
    };

    $scope.reload();

    $scope.editRecord = function (record) {
        $scope.modalTitle = "修改咨询记录";
        $scope.cur_record_id = record.id;
    };

    $scope.saveCnslr = function () {
        var send_m = {
            externalId: Number,
            startTime: String,
            endTime: String
        }
        var start_timestamp = new Date($scope.cur_record.startTime);
        var end_timestamp = new Date($scope.cur_record.endTime);
        send_m.externalId = $scope.cur_record.externalId;
        send_m.startTime = start_timestamp;
        send_m.endTime = end_timestamp;

        xxHttp.post("/server/console/consult/" + $scope.cur_record_id + "/manual_hangup", send_m, null, function (payload) {
            $scope.reload();
            alert("修改成功！");
            SharedState.turnOff("editFrom");
        });
    };
}];

/**
 * 咨询师列表
 */
var cnslrListCtlr = ["$rootScope", "$scope", "$location","$filter", "xxHttp", "xxPage", "SharedState", "Upload", function ($rootScope, $scope, $location, $filter, xxHttp, xxPage, SharedState, Upload) {
    $scope.selected = null;
    $scope.p_post_counselor = [{
        method: "POST",
        url: "/console/counselor"
    }];

    $scope.p_put_counselor = [{
        method: "PUT",
        url: "/console/counselor/*"
    }];

    $scope.p_put_counselor_photo = [{
        method: "PUT",
        url: "/console/counselor/*/photo"
    }];

    $scope.p_put_counselor_online = [{
        method: "PUT",
        url: "/console/counselor/*/online"
    }];

    $scope.p_get_counselor_online_history = [{
        method: "GET",
        url: "/console/counselor/*/online_history"
    }];

    $scope.p_put_counselor_state = [{
        method: "PUT",
        url: "/console/counselor/*/state"
    }];

    $scope.cnslrStateMap = {
        NORMAL: "正常",
        CANCELLED: "注销"
    };
    $scope.skills = {};
    $scope.input_skills = {};   //选中的技能
    var fetchFunc = function (page, size, callback) {
        xxHttp.get("/server/console/counselor", {
            params: {
                keyword: $scope.param_keyword,
                onlines: $scope.param_state,
                page: page,
                size: size
            }
        }, callback);
    };

    $scope.reload = function () {
        $scope.param_keyword = $scope.input_keyword;
        $scope.param_state = $scope.input_state;
        $scope.selected = null;
        $scope.page = xxPage(fetchFunc, 50);
    };

    $scope.reload();

    $scope.add = function () {
        $scope.modalTitle = "添加咨询师";
        $scope.counselor = {};
        $scope.selectedProject = $scope.counselor.institution;
        $scope.loadSkillsDefault();
    };


    $scope.modify = function (counselor) {
        $scope.modalTitle = "修改咨询师资料";
        $scope.counselor = counselor;
        $scope.selectedProject = $scope.counselor.institution;
        $scope.loadSkillsDefault(counselor);
    };

    //添加咨询师技能
    $scope.loadSkillsDefault = function (counselor) {
        xxHttp.get("/server/publics/counselor_skill", null, function (payload) {
            $scope.skills = payload;
            for (var index in payload) {
                $scope.input_skills[payload[index].id] = false;  //选中的默认为false
            }
            if (counselor) {
                for (var temp_index in counselor.skills) {
                    $scope.input_skills[counselor.skills[temp_index].id] = true;  //已被选中的
                }
            }
        });
    };
    //点中技能标签
    $scope.selectSkill = function (skill) {
        var nSelected = 0;
        for (var index in $scope.input_skills) {
            if ($scope.input_skills[index]) {
                nSelected++;
            }
        }
        if (nSelected >= 2 && !$scope.input_skills[skill.id]) {
            alert("您最多选择2个擅长的领域");
        } else {
            $scope.input_skills[skill.id] = !$scope.input_skills[skill.id];
        }
    };

    $scope.selectedProjectFn = function (selected) {
        if (selected) {
            $scope.selectedProject = selected.originalObject;
        } else {
            $scope.selectedProject = null;
        }
    };

    $scope.set_state = function (s) {
        if (s == "on") {
            $scope.state1 = !$scope.state1;
            $scope.input_state = "TRUE";
        }
        if (s == "off") {
            $scope.state2 = !$scope.state2;
        }
        if ($scope.state1 == true) {
            if ($scope.state2 == true) {
                $scope.input_state = "TRUE,FALSE";
            } else {
                $scope.input_state = "TRUE";
            }
        }
        if ($scope.state1 == false) {
            if ($scope.state2 == true) {
                $scope.input_state = "FALSE";
            } else {
                $scope.input_state = null;
            }
        }
    };

    $scope.saveCnslr = function () {
        var cur_skill = [];
        if ($scope.counselor.alipayAccount == "") {
            $scope.counselor.alipayAccount = null;
        }
        if ($scope.counselor.alipayName == "") {
            $scope.counselor.alipayName = null;
        }
        if ($scope.counselor.alipayAccount && !$scope.counselor.alipayName) {
            alert("填写支付宝账号后，必须同时填写支付宝姓名！");
            return;
        }
        if (!$scope.counselor.alipayAccount && $scope.counselor.alipayName) {
            alert("填写支付宝姓名后，必须同时填写支付宝账号！");
            return;
        }
        if ($scope.counselor.id == null) { 					//新增咨询师信息
            var nSelected = 0;
            var temp = [];
            for (var index in $scope.input_skills) {
                if ($scope.input_skills[index]) {
                    //temp[nSelected] = index;
                    cur_skill.push({
                        "id" : index
                    });
                    nSelected++;
                }
            }
            if (nSelected == 0) {
                alert("请至少选择1个擅长领域!");
                return;
            }
            //for (var index = 0; index < nSelected; index++) {
            //    cur_skill[index] = $scope.skills[temp[index] - 1];
            //}
            $scope.counselor.skills = cur_skill;
            $scope.counselor.institution = $scope.selectedProject;
            xxHttp.post("/server/console/counselor", $scope.counselor, null, function (payload) {
                alert("录入咨询师成功！");
                $scope.reload();
                SharedState.turnOff("cnslrForm");
            });
            //$scope.reload();
        } else {				//或者是修改咨询师信息
            var nSelected = 0;
            var temp = [];
            for (var index in $scope.input_skills) {
                if ($scope.input_skills[index]) {
                    //temp[nSelected] = index;
                    cur_skill.push({
                        "id" : index
                    });
                    nSelected++;
                }
            }
            //for (var index = 0; index < nSelected; index++) {
            //    $scope.counselor.skills[index] = $scope.skills[temp[index] - 1];
            //}
            $scope.counselor.skills = cur_skill;
            $scope.counselor.institution = $scope.selectedProject;
            xxHttp.put("/server/console/counselor/" + $scope.counselor.id, $scope.counselor, null, function (payload) {
                alert("修改咨询师信息成功！");
                $scope.reload();
                SharedState.turnOff("cnslrForm");
            });
            //$scope.reload();
        }
    };

    $scope.switchOnlineState = function (counselor) {
        xxHttp.put("/server/console/counselor/" + counselor.id + "/online", new String(!counselor.online), null, function (payload) {
            counselor.online = !counselor.online;
            if (counselor.online) {
                alert("已切换到开工状态");
            } else {
                alert("已切换到打烊状态");
            }
        });
    };

    $scope.switchCancelled = function (counselor) {
        if (confirm("您确认要注销该咨询师？")) {
            xxHttp.put("/server/console/counselor/" + counselor.id + "/state", new String("CANCELLED"), null, function (payload) {
                alert("该咨询师已被注销");
            });
        }
    };

    $scope.viewOnlineInfo = function (counselor) {
        window.open("/console/cnslr/counselor_online_info/" + counselor.id);
    };

    $scope.initUploadPhoto = function (counselor) {
        $scope.modalTitle = "上传咨询师照片";
        $scope.counselor = counselor;
        $scope.oldPhoto = counselor.photo + "?random=" + Math.random();
    };

    $scope.selectPhoto = function (files) {
        if (files && files.length) {
            if (files[0].size < 51200 || files[0].size > 204800) {
                alert("图片大小必须在50k-200k");
            } else {
                $scope.photoFile = files[0];
            }
        }
    };

    $scope.uploadPhoto = function () {
        var preview = document.getElementById("photo_preview");
        if (preview.naturalWidth != 640 || preview.naturalHeight != 480) {
            alert("必须选择像素为640*480的图片");
            return;
        }
        xxHttp.put("/server/console/counselor/" + $scope.counselor.id + "/photo", null, null, function (payload) {
            $scope.uploadPercentage = 0;
            Upload.http({
                url: payload[0],
                method: "PUT",
                data: $scope.photoFile,
                headers: {
                    "Content-Type": "image/jpeg;charset=UTF-8"
                }
            }).progress(function (evt) {
                $scope.uploadPercentage = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data, status, headers, config) {
                $scope.counselor.photo = payload[1];
                alert("照片上传成功!");
                $scope.photoFile = null;
                $scope.uploadPercentage = null;
                SharedState.turnOff("photoUpload");
            }).error(function () {
                alert("照片上传失败!");
                $scope.uploadPercentage = null;
            });
        });
    };

    $scope.modifyMobileNum = {
        id : Number,
        user : {
            mobile : String
        }
    };
    $scope.counselorMobileOld = "";
    $scope.mobile = {};
    $scope.modifyMobileNumber = function(counselor){
        $scope.modalTitle = "修改咨询师电话号码";
        $scope.mobile = {};
        $scope.modifyMobileNum.id = counselor.id;
        $scope.counselorMobileOld = counselor.user.mobile;
    };

    $scope.saveMobileNum = function(){
        if($scope.counselorMobileOld!=$scope.mobile.Old)
        {
            console.log($scope.counselorMobileOld,$scope.mobile.Old);
            alert("原始号码输入有误！");
            return;
        }
        else
            $scope.modifyMobileNum.user.mobile = $scope.mobile.New;
        xxHttp.put("/server/console/counselor/mobile" , $scope.modifyMobileNum, null, function (payload) {
            $scope.reload();
            SharedState.turnOff("modifyMobileNum");
        });
    };

    /*设置工作时段*/
    $scope.setWorkTime=function(counselor){
        $scope.modalTitle = "设置工作时段";
        $scope.counselor= counselor;

    $scope.timeSetting;
    $scope.hoursOfCurrentDay;

    $scope.loadTimeSetting = function() {
        xxHttp.get("/server/console/counselor/"+$scope.counselor.id+"/work_time", null, function(payload) {
            $scope.timeSetting = payload;
            $scope.displayHoursOfDay(1);// 默认显示周一
        });
    };
    $scope.loadTimeSetting();// 进入页面时首先从服务器加载已有设置

    /**
     * 显示对应天的被选中小时
     */
    $scope.displayHoursOfDay = function(dayOfWeek) {
        $scope.selectedDay = dayOfWeek;// 将选中的天保存到$scope变量中
        var hoursOfSelectedDay = $filter("filter")($scope.timeSetting, function(e) {
            return e.counselorWorkDay == dayOfWeek;
        });// 过滤出所有属于这天的work_time
        $scope.hoursOfCurrentDay = new Array(24);// 每天都是长度为24的true/false数组，index表示一天中的小时，如[true,true,false...]表示0点1点已选，3点未选
        for (var i = 0; i < 24; i++) {
            var selectedHour = $filter("filter")(hoursOfSelectedDay, function(e) {
                return e.counselorWorkHour == i;
            });// 通过遍历每个小时来过滤对应的小时有没有设置过
            $scope.hoursOfCurrentDay[i] = selectedHour.length > 0;// 设置过的数组长度为1，未设置过的会返回空数组
        }
    };

    /**
     * 将当前这天的新设置小时数保存回timeSetting中
     */
    $scope.saveHoursOfCurrentDay = function() {
        var selectedHoursOfOtherDay = $filter("filter")($scope.timeSetting, function(e) {
            return e.counselorWorkDay != $scope.selectedDay;
        });// 选出除了选中当天外的所有设置时间，例如当前是周一，则这里返回的是周二、三、四、五、六、日的设置
        var hoursToSave = [];
        for (var i = 0; i < 24; i++) {
            if ($scope.hoursOfCurrentDay[i]) {// 如果对应index的元素为true，则表明对应小时被选中，应当加入hoursToSave数组队尾
                hoursToSave[hoursToSave.length] = {
                    counselorWorkDay : $scope.selectedDay,
                    counselorWorkHour : i
                };
            }
        }
        $scope.timeSetting = selectedHoursOfOtherDay.concat(hoursToSave);// 将当天之外的设置和当天新选的设置连接起来，即为新的设置
    };

    /**
     * 切换一周中的日子时，首先保存当前已经修改的天的设置，另外要将新选中天的设置显示出来
     */
    $scope.switchDay = function(dayOfWeek) {
        $scope.saveHoursOfCurrentDay();
        $scope.displayHoursOfDay(dayOfWeek);
    };

    $scope.submit = function() {
        $scope.saveHoursOfCurrentDay();// 提交服务器之前要先将当前页的小时设置保存到到timeSetting中
        ///console/counselor/{counselorId}/work_time
        xxHttp.put("/server/console/counselor/"+$scope.counselor.id+"/work_time", $scope.timeSetting, null, function(payload) {
            alert("保存成功");
            SharedState.turnOff("setWorkTime");
        });
    };
    }
}];

/**
 * 咨询师上下线列表
 */
var cnslrOnlineListCtlr = ["$rootScope", "$scope", "xxHttp", "xxPage", "SharedState", function ($rootScope, $scope, xxHttp, xxPage, SharedState) {
    $scope.selected = null;

    $scope.p_get_counselor_online_history = [{
        method: "GET",
        url: "/console/counselor/online_history"
    }];

    $scope.source = {
        STAFF: "管理员",
        SELF: "本人"
    };
    $scope.type = {
        true: "上线",
        false: "下线"
    };

    $scope.input_source = {
        STAFF: true,
        SELF: true
    };
    $scope.input_type = {
        TRUE: true,
        FALSE: true
    };

    var fetchFunc = function (page, size, callback) {
        xxHttp.get("/server/console/counselor/online_history", {
            params: {
                keyword: $scope.param_keyword,
                types: $scope.param_type,
                sources: $scope.param_source,
                page: page,
                size: size
            }
        }, callback);
    };

    $scope.reload = function () {
        $scope.param_keyword = $scope.input_keyword;
        $scope.param_source = [];
        for (var source in $scope.input_source) {
            if ($scope.input_source[source]) {
                $scope.param_source[$scope.param_source.length] = source;
            }
        }
        $scope.param_source = $scope.param_source.join();

        $scope.param_type = [];
        for (var type in $scope.input_type) {
            if ($scope.input_type[type]) {
                $scope.param_type[$scope.param_type.length] = type;
            }
        }
        $scope.param_type = $scope.param_type.join();
        $scope.selected = null;
        $scope.page = xxPage(fetchFunc, 50);
    };

    $scope.reload();
}];

/**
 * 咨询师上下线:某个咨询师的历史
 */
var cnslrOnlineInfoCtlr = ["$rootScope", "$scope", "$routeParams", "xxHttp", "xxPage", "SharedState", function ($rootScope, $scope, $routeParams, xxHttp, xxPage, SharedState) {
    $scope.source = {
        STAFF: "管理员",
        SELF: "本人"
    };

    $scope.type = {
        true: "上线",
        false: "下线"
    };

    $scope.input_source = {
        STAFF: false,
        SELF: true
    };

    $scope.input_type = {
        TRUE: true,
        FALSE: false
    };

    var fetchFunc = function (page, size, callback) {
        xxHttp.get("/server/console/counselor/" + $routeParams.counselor_id + "/online_history", {
            params: {
                page: page,
                size: size
            }
        }, callback);
    };

    $scope.reload = function () {
        $scope.page = xxPage(fetchFunc, 50);
    };

    $scope.reload();
}];

/**
 * 咨询师审批
 */
var cnslrApplyListCtlr = ["$rootScope", "$scope", "xxHttp", "xxPage", "SharedState", function ($rootScope, $scope, xxHttp, xxPage, SharedState) {
    $scope.selected = null;

    $scope.p_get_counselor_apply = [{
        method: "GET",
        url: "/console/counselor/apply"
    }];

    $scope.p_put_counselor_apply = [{
        method: "PUT",
        url: "/console/counselor/apply/*"
    }];

    $scope.stateMap = {
        SUBMITTED: "已提交",
        ACCEPTED: "通过",
        REJECTED: "不通过"
    };

    $scope.typeMap = {
        REGISTER: "注册",
        MODIFY: "修改"
    };

    $scope.input_states = {
        SUBMITTED: true
    };

    var fetchFunc = function (page, size, callback) {
        xxHttp.get("/server/console/counselor/apply", {
            params: {
                keyword: $scope.param_keyword,
                states: $scope.param_states,
                page: page,
                size: size
            }
        }, callback);
    };

    $scope.reload = function () {
        $scope.param_keyword = $scope.input_keyword;
        $scope.param_states = [];
        // console.log($scope.input_states);
        for (var state in $scope.input_states) {
            // console.log(state);
            if ($scope.input_states[state]) {
                $scope.param_states[$scope.param_states.length] = state;
            }
        }
        $scope.param_states = $scope.param_states.join();
        $scope.selected = null;
        $scope.page = xxPage(fetchFunc, 50);
    };

    $scope.reload();

    $scope.set_id = function (cnslrApply) {
        $scope.cnslrApply = cnslrApply;
    };

    $scope.accept = function (cnslrApply) {
        if (confirm("确认当前申请审批通过？")) {
            xxHttp.put("/server/console/counselor/apply/" + cnslrApply.id, null, {
                params: {
                    action: "accept"
                }
            }, function (payload) {
                alert("审核通过");
                $scope.reload();
            });
        }
    };

    $scope.refuse = function (s) {
        if (confirm("确认当前申请审批不通过？")) {
            xxHttp.put("/server/console/counselor/apply/" + $scope.cnslrApply.id, null, {
                params: {
                    action: "reject",
                    rejectReason: s
                }
            }, function (payload) {
                alert("审核确认不通过");
                $scope.reload();
            });
        }
    };
}];

/**
 * 咨询机构列表
 */

var cnsorgListCtlr = ["$rootScope", "$scope", "xxHttp", "xxPage", "Upload", "SharedState", function ($rootScope, $scope, xxHttp, xxPage, Upload, SharedState) {
    $scope.disabled = true;
    $scope.selected = null;
    $scope.Text = "";

    $scope.p_get_institution = [{
        method: "GET",
        url: "/console/partner/institution"
    }];

    $scope.p_post_institution = [{
        method: "POST",
        url: "/console/partner/institution"
    }];

    $scope.p_put_institution_photo = [{
        method: "PUT",
        url: "/console/partner/institution/*/photo"
    }];

    $scope.stateMap = {
        NORMAL: "正常"
    };

    var fetchFunc = function (page, size, callback) {
        xxHttp.get("/server/console/partner/institution", {
            params: {
                keyword: $scope.param_keyword,
                page: page,
                size: size
            }
        }, function (payload) {
            //payload.introduction = $sce.trustAsHtml((payload.introduction).replace(/\n/g, "<br/>"));
            //payload.introduction = payload.introduction.replace(/\n/g,"<br/>");
            callback(payload);
        });
    };

    $scope.reload = function () {
        $scope.param_keyword = $scope.input_keyword;
        $scope.selected = null;
        $scope.page = xxPage(fetchFunc, 50);
    };

    $scope.reload();

    $scope.add = function () {
        $scope.modalTitle = "添加咨询机构";
        $scope.institution = {};
        $scope.district="";
        $scope.city="";
        $scope.province="";
        xxHttp.get("/server/console/sys/no_auth/province", null, function (payload) {
            $scope.provinces = payload;
        });
    };

    $scope.modify = function (institution) {
        $scope.modalTitle = "修改咨询机构";
        $scope.institution = institution;
        $scope.district=$scope.institution.district.code;
        $scope.city=$scope.institution.district.owner.code;
        $scope.province=$scope.institution.district.owner.owner.code;
        function load(){
            xxHttp.get("/server/console/sys/no_auth/province", null, function (payload) {
                $scope.provinces = payload;
            });
            xxHttp.get("/server/console/sys/no_auth/" + $scope.province + "/city", null, function (payload) {
                $scope.citys = payload;
            });
            xxHttp.get("/server/console/sys/no_auth/province/" + $scope.city + "/district", null, function (payload) {
                $scope.districts = payload;
            });
        }
        load();
        $scope.disabled = false;
    };

    $scope.add_city = function (s) {
        xxHttp.get("/server/console/sys/no_auth/" + s + "/city", null, function (payload) {
            $scope.citys = payload;
        });
    };

    $scope.add_district = function (s) {
        xxHttp.get("/server/console/sys/no_auth/province/" + s + "/district", null, function (payload) {
            $scope.districts = payload;
        });
    };

    $scope.set_institution = function (s) {
        $scope.institution.district = {code: s};
    };



    $scope.set_disabled = function () {
        if ($scope.institution.bank == "") {
            $scope.disabled = true;
        } else {
            $scope.disabled = false;
        }
    };

    $scope.saveInstitution = function () {
        if ($scope.institution.id == null) {
            if ($scope.institution.bank == "") {
                $scope.institution.bank = null;
            }

            xxHttp.post("/server/console/partner/institution/", $scope.institution, null, function (payload) {
                alert("录入咨询机构成功！");
                SharedState.turnOff("institutionForm");
            });
            $scope.reload();
        } else {
            xxHttp.put("/server/console/partner/institution/" + $scope.institution.id, $scope.institution, null, function (payload) {
                alert("修改咨询机构成功！");
                SharedState.turnOff("institutionForm");
            });
            $scope.reload();
        }
        $scope.reload();
    };


    $scope.initUploadPhoto = function (institution) {
        $scope.modalTitle = "咨询机构的主图";
        $scope.institution = institution;
        $scope.oldPhoto = institution.mainPhoto + "?random=" + Math.random();
        //$scope.oldPhoto = "http://test-store.xinqingxiangjiao.com/image/institution/photo/"+institution.id+".jpg";
    };

    $scope.selectPhoto = function (files) {
        if (files && files.length) {
            if (files[0].size < 102400 || files[0].size > 307200) {
                alert("图片大小必须在100k-300k");
            } else {
                $scope.photoFile = files[0];
            }
        }
    };

    $scope.uploadPhoto = function () {
        var preview = document.getElementById("photo_preview");
        if (preview.naturalWidth != 1024 || preview.naturalHeight != 768) {
            alert("必须选择像素为1024*768的图片");
            return;
        }
        xxHttp.put("/server/console/partner/institution/" + $scope.institution.id + "/photo", null, null, function (payload) {
            $scope.uploadPercentage = 0;
            Upload.http({
                url: payload[0],
                method: "PUT",
                data: $scope.photoFile,
                headers: {
                    "Content-Type": "image/jpeg;charset=UTF-8"
                }
            }).progress(function (evt) {
                $scope.uploadPercentage = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data, status, headers, config) {
                $scope.institution.photo = payload[1];
                alert("照片上传成功!");
                $scope.photoFile = null;
                $scope.uploadPercentage = null;
                SharedState.turnOff("photoUpload");
            }).error(function () {
                alert("照片上传失败!");
                $scope.uploadPercentage = null;
            });
        });
        $scope.reload();
    };
}];

/**
 * 咨询手记管理
 */
var cnslrNoteCtlr = ["$rootScope", "$scope", "$sce", "xxHttp", "xxPage", "Upload", "SharedState", function ($rootScope, $scope, $sce, xxHttp, xxPage, Upload, SharedState) {
    $scope.selected = null;
    $scope.sicks = {};
    $scope.input_sicks = {};

    $scope.p_get_note = [{
        method: "GET",
        url: "/console/counselor/note"
    }];

    $scope.p_post_note = [{
        method: "POST",
        url: "/console/counselor/note"
    }];

    var fetchFunc = function (page, size, callback) {
        xxHttp.get("/server/console/counselor/note", {
            params: {
                keyword: $scope.param_keyword,
                page: page,
                size: size
            }
        }, callback);
    };

    $scope.reload = function () {
        $scope.param_keyword = $scope.input_keyword;
        $scope.selected = null;
        $scope.page = xxPage(fetchFunc, 50);
    };

    $scope.reload();

    $scope.add = function () {
        $scope.modalTitle = "添加咨询手记";
        $scope.handnote = {};
        $scope.selectedProject = "";
        $scope.loadSkillsDefault();
    };

    $scope.modify = function (handnote) {
        $scope.modalTitle = "修改咨询手记";
        $scope.handnote = handnote;
        $scope.selectedProject = handnote.counselor;
        $scope.loadSkillsDefault(handnote);
    };

    //添加病症
    $scope.loadSkillsDefault = function (handnote) {
        xxHttp.get("/server/console/counselor/no_auth/mood_problem", null, function (payload) {
            $scope.sicks = payload;
            for (var index in payload) {
                $scope.input_sicks[payload[index].id] = false;  //选中的默认为false
            }
            if (handnote) {
                console.log(handnote);
                for (var temp_index in handnote.problems) {
                    $scope.input_sicks[handnote.problems[temp_index].id] = true;  //已被选中的
                }
            }
        });
    };
    //点中病症标签
    $scope.selectSicks = function (sick) {
        var nSelected = 0;
        for (var index in $scope.input_sicks) {
            if ($scope.input_sicks[index]) {
                nSelected++;
            }
        }
        $scope.input_sicks[sick.id] = !$scope.input_sicks[sick.id];
    };

    $scope.selectedProjectFn = function (selected) {
        if (selected) {
            $scope.selectedProject = selected.originalObject;
        } else {
            $scope.selectedProject = null;
        }
    };

    $scope.initUploadPhoto = function (institution) {
        $scope.modalTitle = "手记的主图";
        $scope.institution = institution;
        $scope.oldPhoto = institution.photo;
    };

    $scope.selectPhoto = function (files) {
        if (files && files.length) {
            if (files[0].size < 102400 || files[0].size > 307200) {
                alert("图片大小必须在100k-300k");
            } else {
                $scope.photoFile = files[0];
            }
        }
    };

    $scope.uploadPhoto = function () {
        var preview = document.getElementById("photo_preview");
        if (preview.naturalWidth != 1024 || preview.naturalHeight != 768) {
            alert("必须选择像素为1024*768的图片");
            return;
        }
        xxHttp.put("/server/console/counselor/note/" + $scope.institution.id + "/photo", null, null, function (payload) {
            $scope.uploadPercentage = 0;
            Upload.http({
                url: payload[0],
                method: "PUT",
                data: $scope.photoFile,
                headers: {
                    "Content-Type": "image/jpeg;charset=UTF-8"
                }
            }).progress(function (evt) {
                $scope.uploadPercentage = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data, status, headers, config) {
                $scope.institution.photo = payload[1];
                alert("照片上传成功!");
                $scope.photoFile = null;
                $scope.uploadPercentage = null;
                SharedState.turnOff("photoUpload");
            }).error(function () {
                alert("照片上传失败!");
                $scope.uploadPercentage = null;
            });
        });
        $scope.reload();
    };


    $scope.saveHandnote = function () {
        if($scope.handnote.id == null){
            var cur_sick = [];
            var nSelected = 0;
            var temp = [];
            for (var index in $scope.input_sicks) {
                if ($scope.input_sicks[index]) {
                    cur_sick.push({
                        "id" : index
                    });
                    nSelected++
                }
            }
            if (nSelected == 0) {
                alert("请至少选择1个病症!");
                return;
            }

            $scope.handnote.problems = cur_sick;
            $scope.handnote.counselor = $scope.selectedProject;
            if ($scope.handnote.counselor == "") {
                alert("请选择所属咨询师");
                return;
            }
            var input_date = eval(document.getElementById("dateTime")).value;
            $scope.handnote.happenTime=input_date;
            xxHttp.post("/server/console/counselor/note", $scope.handnote, null, function (payload) {
                alert("保存成功");
                $scope.reload();
                SharedState.turnOff("saveHandnoteForm");
            });
        }else{
            var cur_sick = [];
            var nSelected = 0;
            var temp = [];
            for (var index in $scope.input_sicks) {
                if ($scope.input_sicks[index]) {
                    cur_sick.push({
                        "id" : index
                    });
                    nSelected++
                }
            }
            if (nSelected == 0) {
                alert("请至少选择1个病症!");
                return;
            }

            $scope.handnote.problems = cur_sick;
            $scope.handnote.counselor = $scope.selectedProject;
            if ($scope.handnote.counselor == "") {
                alert("请选择所属咨询师");
                return;
            }
            var input_date = eval(document.getElementById("dateTime")).value;
            $scope.handnote.happenTime=input_date;
            xxHttp.put("/server/console/counselor/note/"+$scope.handnote.id, $scope.handnote, null, function (payload) {
                alert("保存成功");
                $scope.reload();
                SharedState.turnOff("saveHandnoteForm");
            });
        }

    };
}];

/**
 * 用户列表
 */
var userListCtlr = ["$rootScope", "$scope", "xxHttp", "xxPage", "SharedState", function ($rootScope, $scope, xxHttp, xxPage, SharedState) {
    
    var fetchFunc = function (page, size, callback) {
        xxHttp.get("/server/console/user", {
            params: {
                keyword: $scope.param_keyword,
                page: page,
                size: size
            }
        }, callback);
    };

    $scope.reload = function () {
        $scope.param_keyword = $scope.input_keyword;
        $scope.page = xxPage(fetchFunc, 50);
    };

    $scope.reload();

}];

/**
 * 用户组织列表
 */
var userOrgListCtlr = ["$rootScope", "$scope", "xxHttp", "xxPage", "SharedState", function ($rootScope, $scope, xxHttp, xxPage, SharedState) {
    $scope.userGroup = {};
    var fetchFunc = function (page, size, callback) {
        xxHttp.get("/server/console/user/group", {
            params: {
                keyword: $scope.param_keyword,
                page: page,
                size: size
            }
        }, callback);
    };

    $scope.reload = function () {
        $scope.param_keyword = $scope.input_keyword;
        $scope.selected = null;
        $scope.page = xxPage(fetchFunc, 50);
    };

    $scope.reload();

    $scope.add = function(){
        $scope.modalTitle = "新增用户组织";
        $scope.userGroup = {};
    };
    $scope.saveUserGroup = function () {
        //console.log("11111");
        xxHttp.post("/server/console/user/group", $scope.userGroup, null, function (payload) {
            alert("录入用户组织成功！");
            $scope.reload();
            SharedState.turnOff("userGroupFrom");
        });
        $scope.reload();
    };
}];

/**
 * 代金券列表
 */
var couponListCtlr = ["$rootScope", "$scope", "xxHttp", "xxPage", "SharedState", function ($rootScope, $scope, xxHttp, xxPage, SharedState) {
    $scope.selected = null;

    $scope.p_get_cash_coupon_sales = [{
        method: "GET",
        url: "/console/market/cash_coupon_sales"
    }];

    $scope.p_post_cash_coupon_sales = [{
        method: "POST",
        url: "/console/market/cash_coupon_sales"
    }];

    $scope.p_get_cash_coupon = [{
        method: "GET",
        url: "/console/market/cash_coupon_sales/*/cash_coupon"
    }];

    var fetchFunc = function (page, size, callback) {
        xxHttp.get("/server/console/market/cash_coupon_sales", {
            params: {
                keyword: $scope.param_keyword,
                page: page,
                size: size
            }
        }, callback);
    };

    $scope.reload = function () {
        $scope.param_keyword = $scope.input_keyword;
        $scope.selected = null;
        $scope.page = xxPage(fetchFunc, 50);
    };

    $scope.reload();

    $scope.downloadCoupon = function (coupon) {
        window.open("/server/console/market/cash_coupon_sales/" + coupon.id + "/cash_coupon");
    };

    $scope.add = function () {
        $scope.modalTitle = "生成优惠券";
        $scope.coupon = {};
    };

    $scope.createCoupon = function () {
        xxHttp.post("/server/console/market/cash_coupon_sales", $scope.coupon, null, function (payload) {
            alert("成功生成优惠券！");
            SharedState.turnOff("couponCreateForm");
            $scope.reload();
        });
    };
}];

/**
 * 员工列表
 */
var staffListCtlr = ["$rootScope", "$scope", "xxHttp", "xxPage", "SharedState", function ($rootScope, $scope, xxHttp, xxPage, SharedState) {
    $scope.selected = null;

    $scope.p_get_staff = [{
        method: "GET",
        url: "/console/sys/staff"
    }];

    $scope.p_post_staff = [{
        method: "POST",
        url: "/console/sys/staff"
    }];

    $scope.p_put_staff = [{
        method: "PUT",
        url: "/console/sys/staff"
    }];

    $scope.p_get_staff_r_role = [{
        method: "GET",
        url: "/console/sys/staff/*/roles"
    }];

    $scope.p_add_staff_r_role = [{
        method: "PUT",
        url: "/console/sys/staff/*/role"
    }];

    $scope.staffStateMap = {
        NORMAL: "正常",
        CANCEL: "注销"
    };
    $scope.roleListArray = [];

    var fetchFunc = function (page, size, callback) {
        xxHttp.get("/server/console/sys/staff", {
            params: {
                keyword: $scope.param_keyword,
                page: page,
                size: size
            }
        }, callback);
    };

    $scope.reload = function () {
        $scope.param_keyword = $scope.input_keyword;
        $scope.selected = null;
        $scope.page = xxPage(fetchFunc, 50);
    };

    $scope.reload();

    $scope.add = function () {
        $scope.modalTitle = "添加员工";
        $scope.staff = {};
    };

    // todo
    $scope.modify = function (staff) {
        $scope.modalTitle = "修改员工资料";
        $scope.staff = staff;
    };

    $scope.saveStaff = function () {
        if ($scope.staff.id == null) {
            xxHttp.post("/server/console/sys/staff", $scope.staff, null, function (payload) {
                alert("录入员工成功！");
                SharedState.turnOff("staffForm");
            });
        } else {
            // todo
            xxHttp.put("/server/console/sys/staff/" + $scope.staff.id, $scope.staff, null, function (payload) {
                SharedState.turnOff("staffForm");
            });
        }
    };

    /* 点击关联角色 */
    $scope.configRole = function (staff) {
        $scope.staff = staff;
        $scope.roleListArray = [];
        xxHttp.get("/server/console/sys/staff/" + staff.id + "/roles", null, function (payload) {
            $scope.roleListArray = payload;
        });
    };

    $scope.exclude = function (resource) {
        var index = $scope.roleListArray[0].indexOf(resource);
        if (index > -1) {
            $scope.roleListArray[0].splice(index, 1);
        }
        $scope.roleListArray[1].push(resource);
    };

    $scope.include = function (resource) {
        var index = $scope.roleListArray[1].indexOf(resource);
        if (index > -1) {
            $scope.roleListArray[1].splice(index, 1);
        }
        $scope.roleListArray[0].push(resource);
    };

    // 保存该员工的角色选择
    $scope.saveStaffRole = function () {
        var roleIdArray = [];
        for (var i = 0; i < $scope.roleListArray[0].length; i++) {
            roleIdArray.push($scope.roleListArray[0][i].id);
        }
        xxHttp.put("/server/console/sys/staff/" + $scope.staff.id + "/role", roleIdArray, null, function (payload) {
            alert("该员工的角色选择成功");
            SharedState.turnOff("roleList");
        });
    };
}];

/**
 * 角色列表
 */
var roleListCtlr = ["$rootScope", "$scope", "xxHttp", "xxPage", "SharedState", function ($rootScope, $scope, xxHttp, xxPage, SharedState) {
    $scope.selected = null;

    $scope.p_get_role = [{
        method: "GET",
        url: "/console/sys/role"
    }];

    $scope.p_post_role = [{
        method: "POST",
        url: "/console/sys/role"
    }];

    $scope.p_get_role_r_res = [{
        method: "GET",
        url: "/console/sys/*/resource"
    }];
    $scope.p_add_role_r_res = [{
        method: "PUT",
        url: "/console/sys/*/resource"
    }];
    $scope.resListArray = [];

    var fetchFunc = function (page, size, callback) {
        xxHttp.get("/server/console/sys/role", {
            params: {
                keyword: $scope.param_keyword,
                page: page,
                size: size
            }
        }, callback);
    };

    $scope.reload = function () {
        $scope.param_keyword = $scope.input_keyword;
        $scope.selected = null;
        $scope.page = xxPage(fetchFunc, 50);
    };

    $scope.reload();

    /* 点击关联资源 */
    $scope.configRes = function (role) {
        $scope.role = role;
        $scope.resListArray = [];
        xxHttp.get("/server/console/sys/" + role.id + "/resource", null, function (payload) {
            $scope.resListArray = payload;
        });
    };

    $scope.exclude = function (resource) {
        var index = $scope.resListArray[0].indexOf(resource);
        if (index > -1) {
            $scope.resListArray[0].splice(index, 1);
        }
        $scope.resListArray[1].push(resource);
    };

    $scope.include = function (resource) {
        var index = $scope.resListArray[1].indexOf(resource);
        if (index > -1) {
            $scope.resListArray[1].splice(index, 1);
        }
        $scope.resListArray[0].push(resource);
    };

    // 保存该角色的资源配置
    $scope.saveRoleRes = function () {
        var resIdArray = [];
        for (var i = 0; i < $scope.resListArray[0].length; i++) {
            resIdArray.push($scope.resListArray[0][i].id);
        }
        xxHttp.put("/server/console/sys/" + $scope.role.id + "/resource", resIdArray, null, function (payload) {
            alert("该角色的资源配置成功");
            SharedState.turnOff("resList");
        });
    };

    $scope.add = function () {
        $scope.modalTitle = "添加角色";
        $scope.role = {};
    };

    // 添加/修改角色
    $scope.saveRole = function () {
        if ($scope.role.id == null) {
            xxHttp.post("/server/console/sys/role", $scope.role, null, function (payload) {
                alert("录入角色成功！");
                SharedState.turnOff("roleForm");
            });
        } else {
            // todo
            xxHttp.put("/server/console/sys/role/" + $scope.role.id, $scope.role, null, function (payload) {
                SharedState.turnOff("roleForm");
            });
        }
    };
}];

/**
 * 申请提现列表
 */
var withdrawListCtlr = ["$rootScope", "$scope", "xxHttp", "xxPage", "SharedState", function ($rootScope, $scope, xxHttp, xxPage, SharedState) {
    $scope.selected = null;

    $scope.p_get_counselor_account_flow = [{
        method: "GET",
        url: "/console/counselor/account_flow"
    }];

    $scope.p_put_counselor_account_flow = [{
        method: "PUT",
        url: "/console/counselor/account_flow/*"
    }];

    $scope.state = {
        FAILED: "失败",
        ONGOING: "进行中",
        SUCCESS: "已成功"
    };

    $scope.input_states = {
        FAILED: true,
        ONGOING: true,
        SUCCESS: true
    };

    var fetchFunc = function (page, size, callback) {
        xxHttp.get("/server/console/counselor/account_flow", {
            params: {
                changeTypes: "WITHDRAW",
                keyword: $scope.param_keyword,
                states: $scope.param_states,
                page: page,
                size: size
            }
        }, callback);
    };

    $scope.reload = function () {
        $scope.param_keyword = $scope.input_keyword;
        $scope.param_states = [];
        for (var state in $scope.input_states) {
            if ($scope.input_states[state]) {
                $scope.param_states[$scope.param_states.length] = state;
            }
        }
        $scope.param_states = $scope.param_states.join();
        $scope.selected = null;
        $scope.page = xxPage(fetchFunc, 50);
    };

    $scope.reload();

    $scope.finishWithdraw = function (withdraw) {
        $scope.modalTitle = "提醒";
        $scope.withdraw = withdraw;
    };

    $scope.finishWithdrawAction = function () {
        xxHttp.put("/server/console/counselor/account_flow/" + $scope.withdraw.id + "?action=finish_withdraw", null, null, function (payload) {
            alert("已完成提现");
            $scope.reload();
        });
    };
}];

var statUserCountCtlr = ["$scope", "xxHttp", function ($scope, xxHttp) {
    $scope.datas;
    $scope.messages;
    $scope.day;

    $scope.p_get_user_total = [{
        method: "GET",
        url: "/console/statistic/user/total"
    }];

    $scope.register_data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];
    $scope.register_labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.register_series = ["注册用户数"];
    $scope.total_data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];
    $scope.total_labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.total_series = ["注册用户数"];

    $scope.loadData = function (range) {
        $scope.register_data = [[]];
        $scope.register_labels = [];
        xxHttp.get("/server/console/statistic/user/register", {
            params: {
                range: range
            }
        }, function (payload) {
            $scope.datas = payload;
            for (var index in payload) {
                $scope.register_data[0] = $scope.register_data[0].concat(payload[index].C);
                $scope.register_labels = $scope.register_labels.concat(payload[index].U);
            }
            console.log($scope.register_data[0]);
        });
        $scope.total_data = [[]];
        $scope.total_labels = [];
        xxHttp.get("/server/console/statistic/user/total", {
            params: {
                range: range
            }
        }, function (payload) {
            $scope.messages = payload;
            for (var index in payload) {
                $scope.total_data[0] = $scope.total_data[0].concat(payload[index].C);
                $scope.total_labels = $scope.total_labels.concat(payload[index].U);
            }
        });

        $scope.day = range;
    };

    $scope.loadData("30day");
}];

var statUserBillCtlr = ["$scope", "xxHttp", function ($scope, xxHttp) {
    $scope.day;

    $scope.p_get_user_balance_flow = [{
        method: "GET",
        url: "/console/statistic/user/balance_flow"
    }];

    $scope.bill_data = [
        [65, 59, 80, 81, 56, 55, 40],
        [65, 59, 80, 81, 56, 55, 40],
        [65, 59, 80, 81, 56, 55, 40]
    ];
    $scope.bill_labels = [];
    $scope.bill_series = ["充值金额", "消费金额", "赠送金额"];

    $scope.loadData = function (range) {
        $scope.bill_data = [[], [], []];
        $scope.bill_labels = [];
        xxHttp.get("/server/console/statistic/user/balance_flow", {
            params: {
                range: range
            }
        }, function (payload) {
            $scope.datas = payload.CHARGE;
            for (var j = 0; j < payload.CHARGE.length; j++) {
                $scope.bill_data[0] = $scope.bill_data[0].concat(payload.CHARGE[j].C);
            }
            $scope.messages = payload.CONSULT;
            for (var j = 0; j < payload.CONSULT.length; j++) {
                $scope.bill_data[1] = $scope.bill_data[1].concat(payload.CONSULT[j].C);
            }
            $scope.jsons = payload.PRESENT;
            for (var j = 0; j < payload.PRESENT.length; j++) {
                $scope.bill_data[2] = $scope.bill_data[2].concat(payload.PRESENT[j].C);
                $scope.bill_labels = $scope.bill_labels.concat(payload.PRESENT[j].U);
            }
        });
        $scope.day = range;
    }

    $scope.loadData("30day");
}];

var statUserDurationCtlr = ["$scope", "xxHttp", function ($scope, xxHttp) {
    $scope.day;

    $scope.p_get_session_time = [{
        method: "GET",
        url: "/console/statistic/session_time"
    }];

    $scope.duration_data = [
        [65, 59, 80, 81, 56, 55, 40]
    ];
    $scope.duration_labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.duration_series = ["通话时长"];

    $scope.loadData = function (range) {
        $scope.duration_data = [[]];
        $scope.duration_labels = [];
        xxHttp.get("/server/console/statistic/session_time", {
            params: {
                range: range
            }
        }, function (payload) {
            $scope.datas = payload;
            for (var index in payload) {
                $scope.duration_data[0] = $scope.duration_data[0].concat(payload[index].C);
                $scope.duration_labels = $scope.duration_labels.concat(payload[index].U);
            }
        });
        $scope.day = range;
    };

    $scope.loadData("30day");
}];

var statUserTimeCtlr = ["$scope", "xxHttp", function ($scope, xxHttp) {
    $scope.day;

    $scope.p_get_session_count = [{
        method: "GET",
        url: "/console/statistic/session_count"
    }];

    $scope.time_data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90],
        [38, 28, 40, 34, 36, 50, 60]
    ];
    $scope.time_labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.time_series = ["未接通", "已接通", "已完成的通话"];

    $scope.loadData = function (range) {
        $scope.time_data = [[], [], []];
        $scope.time_labels = [];
        xxHttp.get("/server/console/statistic/session_count", {
            params: {
                range: range
            }
        }, function (payload) {
            $scope.datas = payload.CANCELLED;
            for (var j = 0; j < payload.CANCELLED.length; j++) {
                $scope.time_data[0] = $scope.time_data[0].concat(payload.CANCELLED[j].C);
                $scope.time_labels = $scope.time_labels.concat(payload.CANCELLED[j].U);
            }
            $scope.messages = payload.DISCONNECT;
            for (var j = 0; j < payload.DISCONNECT.length; j++) {
                $scope.time_data[1] = $scope.time_data[1].concat(payload.DISCONNECT[j].C);
            }
            $scope.jsons = payload.FINISHED;
            for (var j = 0; j < payload.FINISHED.length; j++) {
                $scope.time_data[2] = $scope.time_data[2].concat(payload.FINISHED[j].C);
            }

        });
        $scope.day = range;
    };

    $scope.loadData("30day");
}];
/**
 * 查询员工操作记录
 */
var consultOperCtlr = ["$scope", "xxHttp", "xxPage", function ($scope, xxHttp, xxPage) {
    $scope.selected = null;

    $scope.p_get_op_log = [{
        method: "GET",
        url: "/console/sys/op_log"
    }];

    $scope.status = {
        "SUCCESS": "成功",
        "ERR_SYS": "系统错误",
        "ERR_BUS": "业务异常"
    };
    var fetchFunc = function (page, size, callback) {
        xxHttp.get("/server/console/sys/op_log", {
            params: {
                keyword: $scope.param_keyword,
                page: page,
                size: size
            }
        }, callback);
    };

    $scope.reload = function () {
        $scope.param_keyword = $scope.input_keyword;
        $scope.selected = null;
        $scope.page = xxPage(fetchFunc, 50);
    };

    $scope.reload();
}];
