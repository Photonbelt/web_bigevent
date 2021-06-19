$(function () {
	var form = layui.form;
	var layer = layui.layer;

	// 定义昵称验证规则
	form.verify({
		nickname: [/^.{1,6}$/, '昵称必须为1~6个字符']
	})

	// 初始化用户信息
	function getUserInfo() {
		$.ajax({
			method: 'GET',
			url: '/my/userinfo',
			success: function (res) {
				if (res.status !== 0) return layer.msg(res.message);
				form.val('form-userInfo', res.data);
			}
		})
	}

	// 监听表单提交事件
	$('.layui-form').on('submit', function (e) {
		e.preventDefault();
		$.ajax({
			method: 'POST',
			url: '/my/userinfo',
			data: $(this).serialize(),
			success: function (res) {
				if (res.status !== 0) return layer.msg(res.message);
				layer.msg('修改成功！')
				window.parent.renderUserInfo();
			}
		})
	})

	// 点击重置按钮
	$('#reset').on('click', function (e) {
		e.preventDefault();
		getUserInfo();
	})

	getUserInfo();
})