var filters = angular.module("xxFilter", []);

filters.filter("xxDuration", function() {
	return function(input) {
		var output = null;
		if (isNaN(input)) {
			output = null;
		} else {
			var s = input % 60;
			output = s + "秒";
			input -= s;
			if (input > 0) {
				input /= 60;
				var m = input % 60;
				output = m + "分" + output;
				input -= m;
				if (input > 0) {
					input /= 60;
					var h = input;
					output = h + "小时" + output;
				}
			}
		}
		return output;
	};
});

filters.filter("xxDateOrTime", function($filter) {
	return function(input, dateFormat, timeFormat) {
		var format = null;
		if (new Date(input).toDateString() === new Date().toDateString()) {
			format = timeFormat == null ? "HH:mm" : timeFormat;
		} else {
			format = dateFormat == null ? "MM月dd日" : dateFormat;
		}
		return $filter("date")(input, format);
	};
});
