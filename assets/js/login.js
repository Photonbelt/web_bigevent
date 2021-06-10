$(function () {
	// 点击“去注册帐号”的链接
	$('#link_reg').on('click', function () {
		$('.login').hide();
		$('.reg').show();
	})

	// 点击“去登录”的链接
	$('#link_login').on('click', function () {
		$('.reg').hide();
		$('.login').show();
	})

	var form = layui.form;
	var layer = layui.layer;
	// 定义表单输入验证规则
	form.verify({
		pwd: [/^\S{6,12}$/, '密码必须为6到12位，且不能出现空格'],
		repwd: function (value) {
			if (value !== $('.reg [name=password]').val()) return '两次输入的密码不一致!';
		}
	})

	// 监听注册表单的提交事件
	$('#reg-form').on('submit', function (e) {
		e.preventDefault();
		$.post(
			'/api/reguser',
			$(this).serialize(),
			function (res) {
				if (res.status !== 0) return layer.msg(res.message);
				layer.msg('注册成功，请登录！');
				$('#link_login').click();
			}
		)
	})

	// 监听登录表单的提交事件
	$('#login-form').on('submit', function (e) {
		e.preventDefault();
		$.post(
			'/api/login',
			$(this).serialize(),
			function (res) {
				if (res.status !== 0) return layer.msg(res.message);
				layer.msg('登录成功！');
				localStorage.setItem('token', res.token);
				location.href = '/index.html';
			}
		)
	})
})