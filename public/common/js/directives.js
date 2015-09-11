var directives = angular.module("xxDirective", []);
directives.directive("xxLoading", function(){
	return {
		restrict : "E",
		replace : true,
		scope : {
			show : "=xxShow"
		},
		template : "<div class='Loading' ng-show='show'>"
				+ "<div class='spinner'>"
				+ "<div class='circle1 circle'>"+"</div>"
				+ "<div class='circle2 circle'>"+"</div>"
				+ "<div class='circle3 circle'>"+"</div>"
				+ "<div class='circle4 circle'>"+"</div>"
				+ "<div class='circle5 circle'>"+"</div>"
				+ "<div class='circle6 circle'>"+"</div>"
				+ "<div class='circle7 circle'>"+"</div>"
				+ "<div class='circle8 circle'>"+"</div>"
				+ "<div class='circle9 circle'>"+"</div>"
				+ "<div class='circle10 circle'>"+"</div>"
				+ "<div class='circle11 circle'>"+"</div>"
				+ "<div class='circle12 circle'>"+"</div>"
  				+ "</div>" + "</div>"
	};
});

directives.directive('scrollOnClick', function() {
	return {
		restrict: 'A',
		link: function(scope, $elm) {
			$(function(){
				$("body").animate({scrollTop: $elm.offset().top+$("body").height()}, "fast");
				$elm.on('click', function() {
					$("body").animate({scrollTop: $elm.offset().top+$("body").height()}, "fast");
				});
			})

		}
	}
});

directives.directive('stopEvent', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attr) {
			element.on(attr.stopEvent, function (e) {
				e.stopPropagation();
			});
		}
	};
});

var directives2 = angular.module("tw.directives.cropper");//用户端图片裁剪指令
directives2.directive('simpleChange', function simpleChangeDirective() {
	return {
		restrict: 'A',
		link: function(scope, el, attrs) {
			if (!attrs.simpleChange) return;

			el.on('change', function(e) {
				scope.$apply(function() {
					scope.$eval(attrs.simpleChange, {
						$event: e
					});
				});
			});
		}
	};
});


