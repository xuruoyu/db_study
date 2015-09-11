var directives = angular.module("xxDirective", []);
directives.directive("xxPermission", function($rootScope) { // 权限管理
	return {
		restrict : "A",
		scope : {
			permissions : "=xxPermission"
		},
		link : function(scope, element, attrs) {
			var granted = false;
			if ($rootScope.roles != null) {
				for ( var roleIndex in $rootScope.roles) {
					var role = $rootScope.roles[roleIndex];
					if (role.resources != null) {
						for ( var resIndex in role.resources) {
							var res = role.resources[resIndex];
							if (scope.permissions != null) {
								for ( var pIndex in scope.permissions) {
									var p = scope.permissions[pIndex];
									if (p.method === res.method
											&& p.url === res.url) {
										granted = true;
										break;
									}
								}
							}
							if (granted) {
								break;
							}
						}
					}
					if (granted) {
						break;
					}
				}
				if (granted) {
					element.css("display", "block");
				} else {
					element.css("display", "none");
				}
			}
		}
	};
});