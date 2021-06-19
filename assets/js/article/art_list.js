$(function () {
	var layer = layui.layer;
	var laypage = layui.laypage;
	var form = layui.form;
	var data = {
		pagenum: 1,
		pagesize: 2
	}

	// 刷新文章列表
	function updateArtList() {
		$.ajax({
			method: 'GET',
			url: '/my/article/list',
			data: data,
			success: function (res) {
				if (res.status !== 0) return layer.msg(res.message);
				var htmlStr = template('tpl-list', res);
				$('tbody').html(htmlStr);
				renderPage(res.total);
			}
		})
	}

	// 补零函数
	function padZero(n) {
		if (n < 10) return '0' + n;
		return n;
	}
	// 定义格式化时间函数
	template.defaults.imports.dateFormat = function (dateStr) {
		var date = new Date(dateStr);
		var t = {
			y: date.getFullYear(),
			m: padZero(date.getMonth() + 1),
			d: padZero(date.getDate()),
			hh: padZero(date.getHours()),
			mm: padZero(date.getMinutes()),
			ss: padZero(date.getSeconds())
		}
		return t.y + '-' + t.m + '-' + t.d + ' ' + t.hh + ':' + t.mm + ':' + t.ss;
	}

	// 初始化文章分类下拉框
	function initSelectCate() {
		$.ajax({
			method: 'GET',
			url: '/my/article/cates',
			success: function (res) {
				if (res.status !== 0) return layer.msg(res.message);
				var htmlStr = template('tpl-select', res);
				$('[name=cate_id').html(htmlStr);
				form.render();
			}
		})
	}

	// 监听筛选表单提交事件
	$('#form-filter').on('submit', function (e) {
		e.preventDefault();
		var arr = $(this).serializeArray();
		data.cate_id = arr[0].value;
		data.state = arr[1].value;
		updateArtList();
	})

	initSelectCate();
	updateArtList();

	// 渲染分页区
	function renderPage(total) {
		laypage.render({
			elem: 'pagination',
			count: total,
			curr: data.pagenum,
			limit: data.pagesize,
			limits: [2, 3, 5, 10],
			groups: 5,
			layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
			jump: function (params, first) {
				if (!first) {
					data.pagenum = params.curr;
					data.pagesize = params.limit;
					updateArtList();
				}
			}
		});
	};

	// 点击文章标题链接打开预览页面
	$('tbody').on('click', '.link-title', function () {
		$.ajax({
			method: 'GET',
			url: '/my/article/' + $(this).data('id'),
			success: function (res) {
				if (res.status !== 0) return layer.msg(res.message);
				renderArtInfo(res.data);
			}
		})
	})
	// 渲染预览页面文章信息
	function renderArtInfo(article) {
		$.ajax({
			method: 'GET',
			url: '/my/userinfo',
			success: function (res) {
				if (res.status !== 0) layer.msg(res.message);
				article.author = res.data.nickname || res.data.username || '';
				$.ajax({
					method: 'GET',
					url: '/my/article/cates/' + article.cate_id,
					success: function (res) {
						if (res.status !== 0) layer.msg(res.message);
						article.cate = res.data.name || '';
						var htmlStr = template('tpl-preview', article);
						layer.open({
							type: 1,
							title: '预览文章',
							content: htmlStr,
							area: ['80%', '80%']
						});
					}
				})
			}
		})
	}

	// 点击“编辑”按钮
	$('tbody').on('click', '.btn-edit', function () {
		location.href = '/article/art_mod.html?' + $(this).data('id');
	})

	// 点击“删除”按钮
	$('tbody').on('click', '.btn-del', function () {
		var id = $(this).data('id');
		layer.confirm('确定删除此文章吗？', {icon: 3, title:'提示'}, function(index){
			layer.close(index);
			$.ajax({
				method: 'GET',
				url: '/my/article/delete/' + id,
				success: function (res) {
					if (res.status !== 0) return layer.msg(res.message);
					layer.msg('删除成功！');
					if ($('.btn-del').length == 1 && data.pagenum > 1) {
						data.pagenum--;
					}
					updateArtList();
				}
			})
		});
	})
})