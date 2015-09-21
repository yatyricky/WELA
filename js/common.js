$.sort2DArrayByIndex = function (arr, ind) {
	var maxi;
	for (var i = 0; i < arr.length - 1; i ++) {
		maxi = i;
		for (var j = i + 1; j < arr.length; j ++) {
			if (arr[maxi][ind] < arr[j][ind]) {
				maxi = j;
			}
		}
		var tmp = arr[i];
		arr[i] = arr[maxi];
		arr[maxi] = tmp;
	}
}

$.sort2DArrayByIndexAsc = function (arr, ind) {
	var maxi;
	for (var i = 0; i < arr.length - 1; i ++) {
		maxi = i;
		for (var j = i + 1; j < arr.length; j ++) {
			if (parseFloat(arr[maxi][ind]) > parseFloat(arr[j][ind])) {
				maxi = j;
			}
		}
		var tmp = arr[i];
		arr[i] = arr[maxi];
		arr[maxi] = tmp;
	}
}

$.locateInSources = function (ite, arr) {
	for (var i = 0; i < arr.length; i ++) {
		if (ite == arr[i].name) {
			return i;
		}
	}
	return -1;
}