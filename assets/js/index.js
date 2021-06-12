$(function () {
	var layer = layui.layer;

	// 渲染用户信息
	function renderUserInfo() {
		$.ajax({
			method: 'GET',
			url: '/my/userinfo',
			success: function (res) {
				if (res.status !== 0) return layer.msg('获取用户信息失败！');
				var user = res.data;
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
		})
	}

	// 点击退出按钮
	$('#logout').on('click', function () {
		layer.confirm('确认退出登录吗？', {icon: 3, title:'提示'}, function(index){
			layer.close(index);
			localStorage.removeItem('token');
			location.href = '/login.html';
		});
	})

	// 为头部个人中心下拉列表绑定点击事件
	$('#userSelect').on('click', 'dd', function () {
		$('#userList').parent().addClass('layui-nav-itemed');
		$('#userList dd:eq(' + $(this).index() + ') a').get(0).click();
	})
	// 为左侧个人中心列表绑定点击事件
	$('#userList').on('click', 'dd', function () {
		$('#userSelect dd').eq($(this).index()).addClass('layui-this').siblings().removeClass();
	})
	// iframe跳转到其他页面时，去除个人中心下拉列表的选中状态
	$('iframe').on('load', function () {
		if (frames[0].location.href.indexOf('/user/') === -1) $('#userSelect dd').removeClass();
	})

	renderUserInfo();
	window.renderUserInfo = renderUserInfo;
})