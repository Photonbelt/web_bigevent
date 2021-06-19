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
		if (!$('#userList').parent().hasClass('layui-nav-itemed')) {
			$('#userList').siblings('a')[0].click();
		}
		$('#userList dd:eq(' + $(this).index() + ') a').get(0).click();
	})
	// 为左侧个人中心列表绑定点击事件
	$('#userList').on('click', 'dd', function () {
		$('#userSelect dd').eq($(this).index()).addClass('layui-this').siblings().removeClass();
	})
	// 监听iframe页面加载事件
	$('iframe').on('load', function () {
		var href = frames[0].location.href;
		// 非个人中心页面，去除个人中心下拉列表的选中状态
		if (href.indexOf('/user/') === -1) $('#userSelect dd').removeClass();
		// 跳转到文章列表页时，选中导航相应的标签
		if (href.indexOf('/art_list.html') !== -1) $('#articleList dd:eq(1)').addClass('layui-this').siblings().removeClass();
	})

	renderUserInfo();
	window.renderUserInfo = renderUserInfo;
})