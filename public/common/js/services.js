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
			alert("网络繁忙，请稍后再试哦[" + status + "]");
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
		get : function(url, config, onSuccess, onFailure, onError, backend) {
			if (!backend) {
				$rootScope.isLoading = 1;
			}
			$http.get(url, config).success(function(data, status, headers, config) {
				handleServerResult(data, onSuccess, onFailure);
				if (!backend) {
					$rootScope.isLoading = 0;
				}
			}).error(function(data, status, headers, config) {
				handleHttpError(data, status, headers, onError);
				if (!backend) {
					$rootScope.isLoading = 0;
				}
			});
		},
		post : function(url, data, config, onSuccess, onFailure, onError, backend) {
			if (!backend) {
				$rootScope.isLoading = 1;
			}
			$http.post(url, data, config).success(function(data, status, headers, config) {
				handleServerResult(data, onSuccess, onFailure);
				if (!backend) {
					$rootScope.isLoading = 0;
				}
			}).error(function(data, status, headers, config) {
				handleHttpError(data, status, headers, onError);
				if (!backend) {
					$rootScope.isLoading = 0;
				}
			});
		},
		put : function(url, data, config, onSuccess, onFailure, onError, backend) {
			if (!backend) {
				$rootScope.isLoading = 1;
			}
			$http.put(url, data, config).success(function(data, status, headers, config) {
				handleServerResult(data, onSuccess, onFailure);
				if (!backend) {
					$rootScope.isLoading = 0;
				}
			}).error(function(data, status, headers, config) {
				handleHttpError(data, status, headers, onError);
				if (!backend) {
					$rootScope.isLoading = 0;
				}
			});
		},
		delete : function(url, config, onSuccess, onFailure, onError, backend) {
			if (!backend) {
				$rootScope.isLoading = 1;
			}
			$http.delete(url, config).success(function(data, status, headers, config) {
				handleServerResult(data, onSuccess, onFailure);
				if (!backend) {
					$rootScope.isLoading = 0;
				}
			}).error(function(data, status, headers, config) {
				handleHttpError(data, status, headers, onError);
				if (!backend) {
					$rootScope.isLoading = 0;
				}
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
				});
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

