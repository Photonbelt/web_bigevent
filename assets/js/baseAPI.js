$.ajaxPrefilter(function (options) {
	if (options.url.indexOf('/my/') !== -1) {
		options.headers = {Authorization: localStorage.getItem('token')};
		options.complete = function (res) {
			if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
				localStorage.removeItem('token');
				if (frames.length > 0) return location.href = '/login.html';
				parent.location.href = '/login.html';
			}
		}
	}
	options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
})