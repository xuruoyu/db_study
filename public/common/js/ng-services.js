var services = angular.module("xxService", []);
/**
 * 服务器通讯辅助对象
 */
services.factory("xxHttp", function($rootScope, $http) {
	/**
	 * 处理Http错误
	 */
	function handleHttpError(data, status, headers, onError) {
		if (onError != null) {
			onError(data, status, headers);
		} else if (status == 401) {
			alert("登录身份已失效，请重新登录");
		} else if (status == 403) {
			alert("您无权执行该操作，请联系系统管理员");
		} else if (status >= 400) {
			alert("服务器抑郁了，罢工一小会儿~[" + status + "]");
		}
	}
	/**
	 * 处理服务器结果，result为服务器返回的data对象
	 */
	function handleServerResult(result, onSuccess, onFailure) {
		if (result.success) {// 结果正常则调用onSuccess回调
			// onSuccess为success:true时的回调，参数为payload；
			onSuccess(result.payload);
		} else if (onFailure == null) {// 结果不正常且没有onError则直接提示errorMessage
			alert(result.errorMessage);
		} else {// 结果不正常且有onError则执行onError
			// onError为success:false时的回调，参数为errorCode,errorMessage
			onFailure(result.errorCode, result.errorMessage);
		}
	}
	return {
		get : function(url, foreground, onSuccess, config, onFailure, onError) {
			$rootScope.loadingBlock = foreground;
			$rootScope.loading = true;
			$http.get(url, config).success(function(data, status, headers, config) {
				$rootScope.loading = false;
				handleServerResult(data, onSuccess, onFailure);
			}).error(function(data, status, headers, config) {
				$rootScope.loading = false;
				handleHttpError(data, status, headers, onError);
			});
		},
		post : function(url, foreground, onSuccess, data, config, onFailure, onError) {
			$rootScope.loadingBlock = foreground;
			$rootScope.loading = true;
			$http.post(url, data, config).success(function(data, status, headers, config) {
				$rootScope.loading = false;
				handleServerResult(data, onSuccess, onFailure);
			}).error(function(data, status, headers, config) {
				$rootScope.loading = false;
				handleHttpError(data, status, headers, onError);
			});
		},
		put : function(url, foreground, onSuccess, data, config, onFailure, onError) {
			$rootScope.loadingBlock = foreground;
			$rootScope.loading = true;
			$http.put(url, data, config).success(function(data, status, headers, config) {
				$rootScope.loading = false;
				handleServerResult(data, onSuccess, onFailure);
			}).error(function(data, status, headers, config) {
				$rootScope.loading = false;
				handleHttpError(data, status, headers, onError);
			});
		},
		delete : function(url, foreground, onSuccess, config, onFailure, onError) {
			$rootScope.loadingBlock = foreground;
			$rootScope.loading = true;
			$http.delete(url, config).success(function(data, status, headers, config) {
				$rootScope.loading = false;
				handleServerResult(data, onSuccess, onFailure);
			}).error(function(data, status, headers, config) {
				$rootScope.loading = false;
				handleHttpError(data, status, headers, onError);
			});
		}
	};
});
services.factory("xxPage", function() {
	return function(fetchFunc, size) {
		var page = {
			lastPayload : null,
			elements : [],
			loading : false,

			_load : function(page) {
				if(this.loading){
					return;
				}
				this.loading = true;
				var self = this;
				fetchFunc(page, size, function(payload) {
					self.lastPayload = payload;
					self.elements = self.elements.concat(payload.content);
					self.loading = false;
				}, self.elements.length == 0);
			},
			next : function() {
				if (this.hasNext()) {
					this._load(this.lastPayload.number + 1);
				}
			},
			hasNext : function() {
				return this.lastPayload != null ? !this.lastPayload.last : false;
			}
		};
		page._load(0);
		return page;
	};
});

/**
 * 上下文环境
 */
services.factory("xxContext", function($rootScope, $location) {
	return {
		isMicroMessenger : function() {
			return navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger";
		},
		isWeiBo : function(){
			return navigator.userAgent.toLowerCase().match(/WeiBo/i) == "WeiBo";
		},
		goBack : function() {
			if (history.length == 1) {
				$location.path("/").replace();
			} else {
				history.back();
			}
		},
		checkboxValue : function(inputs) {
			var outputs = [];
			for ( var index in inputs) {
				if (inputs[index]) {
					outputs[outputs.length] = index;
				}
			}
			return outputs.join();
		}
	};
});