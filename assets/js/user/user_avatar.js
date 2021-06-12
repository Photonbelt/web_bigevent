$(function () {
	var layer = layui.layer;

	// 生成图片裁剪模块
	var options = {
		// 纵横比
		aspectRatio: 1,
		// 指定预览区域
		preview: '.img-preview'
	};
	$('#image').cropper(options);

	// 点击选择图片按钮
	$('#btnChoose').on('click', function () {
		$('#file').click();
	})

	// 监听文件选择框的change事件
	$('#file').on('change', function () {
		if ($(this)[0].files.length == 0) return;
		var url = URL.createObjectURL($(this)[0].files[0]);
		$('#image').cropper('destroy').prop('src', url).cropper(options);
	})

	// 点击上传按钮，更新用户头像
	$('#btnUpload').on('click', function () {
		var dataURL = $('#image')
			.cropper('getCroppedCanvas', { 
				width: 100,
				height: 100
			})
			.toDataURL('image/png');
		$.ajax({
			method: 'POST',
			url: '/my/update/avatar',
			data: {avatar: dataURL},
			success: function (res) {
				if (res.status !== 0) return layer.msg(res.message);
				layer.msg('头像更新成功！');
				window.parent.renderUserInfo();
			}
		})
	})
})