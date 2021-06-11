$(function () {
	var layer = layui.layer;
	// 获取用户信息
	function getUserInfo() {
		$.ajax({
			method: 'GET',
			url: '/my/userinfo',
			success: function (res) {
				if (res.status !== 0) return layer.msg(res.message);
				renderAvatar(res.data);
			}
		})
	}
	// 渲染头像
	function renderAvatar(user) {
		var uname = user.nickname || user.username;
		$('#uname').text(uname);
		if (user.user_pic) {
			$('.layui-nav-img').prop('src', user.user_pic).show();
			$('.text-avatar').hide();
		} else {
			$('.layui-nav-img').hide();
			$('.text-avatar').text(uname[0].toUpperCase()).css('display', 'inline-block');
		}
	}

	getUserInfo();

	// 点击退出按钮
	$('#logout').on('click', function () {
		layer.confirm('确认退出登录吗？', {icon: 3, title:'提示'}, function(index){
			layer.close(index);
			localStorage.removeItem('token');
			location.href = '/login.html';
		});
	})
})