var app = angular.module("CompetitionConsoleApp", ["ngRoute", "mobile-angular-ui", "xxService"]);


var appRouteConfig = ["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
    $routeProvider.when("/", {
        controller: homeCtlr,
        templateUrl: "views/home.html"
    }).when("/login", {
        controller: loginCtlr,
        templateUrl: "views/login.html",
        auth: false
    }).when("/console/athlete/athlete_list.html", {
        controller: athleteCtlr,
        templateUrl: "views/athlete/athlete_list.html",
    }).when("/console/athlete/team_list.html", {
        controller: teamCtlr,
        templateUrl: "views/athlete/team_list.html",
    }).when("/console/game/competition_list.html", {
        controller: competitionCtlr,
        templateUrl: "views/game/competition_list.html",
    }).when("/console/about", {
        controller: aboutCtlr,
        templateUrl: "views/about.html",
        auth: false
    }).otherwise({
        redirectTo: "/"
    });
    $locationProvider.html5Mode(true);
}];

app.config(appRouteConfig);

app.run(["$rootScope", "$location", "xxHttp", function ($rootScope, $location, xxHttp) {
	
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        $rootScope.isStaffLogin = cookie.get("login_token") != null;
        next.auth = next.auth == null ? true : next.auth;
        if (next.auth && !$rootScope.isStaffLogin) {
            $rootScope.login_back_path = window.location.pathname;
            $location.path("/login");
        }
    });

}]);

app.controller("MainCtrl", ["$scope", "$location", "$timeout", "xxHttp", "xxContext", function ($scope, $location, $timeout, xxHttp) {

    $scope.logout = function () {
        if (confirm("您确认要退出管理平台？")) {
            xxHttp.get("/server/logout", null, function (payload) {
                cookie.remove("login_token");
                cookie.remove("username");
                $location.path("/login");
            });
        }
    };

}]);

/**
 * 首页
 */
var homeCtlr = ["$rootScope", "$scope", function ($rootScope, $scope) {
   
}];

/**
 * 关于
 */
var aboutCtlr = ["$rootScope", "$scope", function ($rootScope, $scope) {

}];



/**
 * 登陆
 */
var loginCtlr = ["$rootScope", "$scope", "$location", "xxHttp", function ($rootScope, $scope, $location, xxHttp) {
    $scope.account = localStorage["username"];
    $scope.password;
    $scope.rememberMe = true;
    $scope.login = function () {
        xxHttp.get("/server/login", {
            params: {
                username: $scope.account,
                password: $scope.password
            }
        }, function (payload) {
            if ($scope.rememberMe) {
                localStorage.setItem("login_account", $scope.account);
            } else {
                localStorage.removeItem("login_account");
            }
            cookie.set("username",$scope.account, {
                path : "/"
            });
            cookie.set("login_token", payload, {
                path : "/"
            });
            $location.path($rootScope.login_back_path == null ? "/" : $rootScope.login_back_path).replace();
        });
    };
}];

/**
 * 运动员列表
 */
var athleteCtlr = ["$rootScope", "$scope", "$location", "xxPage", "xxHttp", "SharedState", function ($rootScope, $scope, $location, xxPage, xxHttp, SharedState) {
    
    $scope.new_athlete_birthday = new Date();
    $scope.athleteState = {
        MALE : "男",
        FEMALE : "女"
    };
    
    var fetchFunc = function(page, size, callback) {
		xxHttp.get("/server/athlete", {
			params : {
				page : page,
				size : size
			}
		}, callback);
	};

	$scope.reload = function() {
		$scope.page = xxPage(fetchFunc, 10);
	};

	$scope.reload();
    
    $scope.add = function () {
        $scope.modalTitle = "添加运动员";
        $scope.athlete = {};
    };


    $scope.modify = function (athlete) {
        $scope.modalTitle = "修改运动员资料";
        $scope.athlete = athlete;
        $scope.new_athlete_birthday = $scope.athlete.birthday;
    };
    
    $scope.saveAthlete = function() {
        $scope.athlete.birthday = eval(document.getElementById("birthday")).value;
        if($scope.athlete.id == undefined){
            xxHttp.post("/server/athlete", $scope.athlete , null, function(payload){
                alert("添加成功");
                SharedState.turnOff("athleteForm");
            }, function(code,errorMessage){
                alert(errorMessage);
                SharedState.turnOff("athleteForm");
            });
            $scope.reload();
        }else{
            xxHttp.put("/server/athlete/" + $scope.athlete.id, $scope.athlete , null, function(payload){
                alert("修改成功");
                SharedState.turnOff("athleteForm");
            }, function(code,errorMessage){
                alert(errorMessage);
                SharedState.turnOff("athleteForm");
            });
            $scope.reload();
        };
    }
}];

/**
 * 团队列表
 */
var teamCtlr = ["$rootScope", "$scope", "$location", "xxPage", "xxHttp", function ($rootScope, $scope, $location, xxPage, xxHttp) {
    
     var fetchFunc = function(page, size, callback) {
		xxHttp.get("/server/athlete_group", {
			params : {
				page : page,
				size : size
			}
		}, callback);
	};

	$scope.reload = function() {
		$scope.page = xxPage(fetchFunc, 10);
	};

	$scope.reload();
    
    $scope.add = function () {
        $scope.modalTitle = "添加团队";
        $scope.team = {};
    };


    $scope.modify = function (team) {
        $scope.modalTitle = "修改团队资料";
        $scope.team = team;
    };
    
}];

/**
 * 比赛列表
 */
var competitionCtlr = ["$rootScope", "$scope", "$location", "xxPage", "xxHttp", function ($rootScope, $scope, $location, xxPage, xxHttp) {
    
    var fetchFunc = function(page, size, callback) {
		xxHttp.get("/server/competition", {
			params : {
				page : page,
				size : size
			}
		}, callback);
	};

	$scope.reload = function() {
		$scope.page = xxPage(fetchFunc, 10);
	};

	$scope.reload();
    
    $scope.add = function () {
        $scope.modalTitle = "添加比赛";
        $scope.competition = {};
    };


    $scope.modify = function (competition) {
        $scope.modalTitle = "修改比赛资料";
        $scope.competition = competition;
    };
    
}];

