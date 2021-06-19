$(function () {
	var layer = layui.layer;
	var form = layui.form;
	var index;

	// 渲染文章类别列表
	function renderArtCates() {
		$.ajax({
			method: 'GET',
			url: '/my/article/cates',
			success: function (res) {
				if (res.status !== 0) return layer.msg(res.message);
				var htmlStr = template('tpl-cate', res);
				$('tbody').html(htmlStr);
			}
		})
	}

	// 初始化编辑类别表单数据
	function initEditForm(id) {
		$.ajax({
			method: 'GET',
			url: '/my/article/cates/' + id,
			success: function (res) {
				if(res.status !== 0) return layer.msg(res.message);
				form.val('form-edit', res.data);
			}
		})
	}

	// 点击“添加类别”按钮
	$('#btnAddCate').on('click', function () {
		index = layer.open({
			type: 1,
			area: ['500px', '250px'],
			title: '添加文章分类',
			content: $('#addCate').html()
		});
	})
	// 监听添加类别表单提交事件
	$('body').on('submit', '#form-add', function (e) {
		e.preventDefault();
		$.ajax({
			method: 'POST',
			url: '/my/article/addcates',
			data: $(this).serialize(),
			success: function (res) {
				if (res.status !== 0) return layer.msg(res.message);
				layer.close(index);
				layer.msg('新增文章分类成功！');
				renderArtCates();
			}
		})
	})

	// 点击“编辑”按钮
	$('tbody').on('click', '.btn-edit', function () {
		index = layer.open({
			type: 1,
			area: ['500px', '250px'],
			title: '修改文章分类',
			content: $('#editCate').html()
		});
		var id = $(this).data('id');
		// 点击“重置”按钮
		$('.btn-reset').on('click', function (e) {
			e.preventDefault();
			initEditForm(id);
		})
		initEditForm(id);
	})
	// 监听编辑类别表单提交事件
	$('body').on('submit', '#form-edit', function (e) {
		e.preventDefault();
		$.ajax({
			method: 'POST',
			url: '/my/article/updatecate',
			data: $(this).serialize(),
			success: function (res) {
				if (res.status !== 0) return layer.msg(res.message);
				layer.close(index);
				layer.msg('更新分类信息成功！');
				renderArtCates();
			}
		})
	})

	// 点击“删除”按钮
	$('tbody').on('click', '.btn-del', function () {
		var id = $(this).data('id');
		layer.confirm('确认删除吗？', {icon: 3, title:'提示'}, function(index){
			$.ajax({
				method: 'GET',
				url: '/my/article/deletecate/' + id,
				success: function (res) {
					if (res.status !== 0) return layer.msg(res.message);
					layer.close(index);
					layer.msg('删除成功！');
					renderArtCates();
				}
			})
		});
	})

	renderArtCates();
})