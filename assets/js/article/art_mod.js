$(function () {
	var layer = layui.layer;
	var form = layui.form;
	var id = location.search.substr(1);
	var options = {
		autoCropArea: 1,
		aspectRatio: 400 / 280,
		preview: '.img-preview'
	};

	// 渲染文本编辑器
	initEditor();
	// 初始化文章详情
	function initArtInfo() {
		$.ajax({
			method: 'GET',
			url: '/my/article/' + id,
			success: function (res) {
				if (res.status !== 0) return layer.msg(res.message);
				var article = res.data;
				form.val('form-artInfo', article);
				form.render();
				tinymce.get('artCon').setContent(article.content);
				// 生成封面裁剪模块
				$('#image')
					.prop('src', 'http://api-breakingnews-web.itheima.net' + article.cover_img)
					.cropper(options)
			}
		})
	}
	// 初始化文章类别下拉列表
	$.ajax({
		method: 'GET',
		url: '/my/article/cates',
		success: function (res) {
			if (res.status !== 0) return layer.msg(res.message);
			var htmlStr = template('tpl-cate', res);
			$('select').html(htmlStr);
			initArtInfo();
		}
	})

	// 点击“选择封面”按钮
	$('#btnCover').on('click', function () {
		$('.file').click();
	})
	// 根据选择的图片重新渲染裁剪模块
	$('.file').on('change', function () {
		if ($(this)[0].files.length <= 0) return;
		var imgURL = URL.createObjectURL($(this)[0].files[0]);
		$('#image').cropper('destroy')
			.prop('src', imgURL)
			.cropper(options);
	})

	// 点击“存为草稿”时修改文章发表状态
	var state = '已发布';
	$('#saveDraft').on('click', function () {
		state = '草稿';
	})
	// 监听表单提交事件
	$('.layui-form').on('submit', function (e) {
		e.preventDefault();
		var fd = new FormData($(this)[0]);
		$('#image')
			.cropper('getCroppedCanvas', {
				width: 400,
				height: 280
			})
			.toBlob(function (blob) {
				fd.append('cover_img', blob);
				fd.append('Id', id);
				fd.append('state', state);
				$.ajax({
					method: 'POST',
					url: '/my/article/edit',
					data: fd,
					contentType: false,
					processData: false,
					success: function (res) {
						if (res.status !== 0) return layer.msg(res.message);
						layer.msg('修改成功！');
						location.href = '/article/art_list.html';
					}
				})
			});
	})

})