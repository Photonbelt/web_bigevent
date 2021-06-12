$(function () {
	var form = layui.form;
	var layer = layui.layer;

	// 定义表单验证规则
	form.verify({
		pwd: [/^\S{6,12}$/, '密码必须为6到12位，且不能出现空格'],
		newpwd: function (value) {
			if (value === $('[name=oldPwd]').val()) return '新密码不能和原密码一样！';
		},
		repwd: function (value) {
			if (value !== $('[name=newPwd]').val()) return '两次输入的密码不一致！';
		}
	})

	// 监听表单提交事件
	$('.layui-form').on('submit', function (e) {
		e.preventDefault();
		$.ajax({
			method: 'POST',
			url: '/my/updatepwd',
			data: $(this).serialize(),
			success: function (res) {
				if (res.status !== 0) return layer.msg(res.message);
				layer.msg('密码修改成功！');
				$('.layui-form')[0].reset();
			}
		})
	})
})