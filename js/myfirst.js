
$(document).ready(function(){
	// 侧边栏 off-canvas
	$('#menu-toggle').click(function(e) {
		e.preventDefault();
		$('#main').toggleClass('toggled');
	});

	// 这一篇文章介绍了如何实现多层级的自动定位(scrollspy)功能。
	// 网址： http://stackoverflow.com/questions/39906280/3-level-hierarchy-with-bootstrap-scrollspy

	// 顶部弹出框(popover)
	$('#top-pop').popover({
		html: true,
	//	container: 'body',
		trigger: 'focus',
		placement: 'bottom',
		content: function () {
			var url = $(this).data('url');

			// 在这里实现 ajax 动态调取内容。
			var content = 'Content of {' + url + '}';
			return content;
		}
	});

	// 顶部模态框(modal)
	$('#top-modal').on('show.bs.modal', function (event) {
		var target = $(event.relatedTarget);
		var modal = $(this);
		var route = target.data('route');
		if (route && route != modal.find('#route').val()) {
			target.parent().siblings().removeClass('active');

			$.ajax({
				url: route,
				// dataType: 'html',
				cache: false,
				beforeSend: function (xhr) {
					modal.html(
						'<div class="modal-dialog" role="document"><div class="modal-content">' +
							'<input type="hidden" id="route" />' +
							'<div class="modal-header">' +
								'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><i class="fa fa-times"></i></span></button>' +
								'<div class="modal-title"><i class="fa fa-spinner fa-pulse fa-fw"></i> 正在加载</div>' +
							'</div>' +
							'<div class="modal-body">加载中，请耐心等待。</div>' +
						'</div></div>'
					);
				},
				success: function(response, status, xhr) {
					// 缓存的菜单项激活
					target.parent().addClass('active');

					// 加载返回的内容
					modal.html(response);

					// 模态框内部的部件需要初始化
					// bootstrap-select
					$('.selectpicker').selectpicker({
						iconBase: 'fa',
						tickIcon: 'fa-check',
						liveSearch: true,
					});

					// bootstrap-datepicker
					// 注意，设置了起始日期和终止日期后，超出范围的原始值不会自动改，且改的新值必须满足相对当前日期的新范围。
					$('.input-daterange').each(function() {
						$(this).datepicker({
							inputs: $(this).children('input'),
							disableTouchKeyboard: true,
							format: 'yyyy-m-d',
							language: 'zh-CN',
							maxViewMode: 3,
							todayBtn: true,
							todayHighlight: true
						});
					});
				},
				error: function(xhr, status, error) {
					modal.html(
						'<div class="modal-dialog" role="document"><div class="modal-content">' +
							'<input type="hidden" id="route" />' +
							'<div class="modal-header">' +
								'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><i class="fa fa-times"></i></span></button>' +
								'<div class="modal-title"><i class="fa fa-cog fa-spin fa-fw"></i> 加载失败</div>' +
							'</div>' +
							'<div class="modal-body">加载失败，请稍后再试。</div>' +
							'<div class="modal-footer">' +
								'<button type="button" class="btn btn-default" data-dismiss="modal">知道了</button>' +
							'</div>' +
						'</div></div>'
					);
				},
			});
		}
	});

	// 侧边栏的层级菜单无需 id 即可折叠
	$('#side-menu [data-toggle="collapse-menu"]').on('click', function(e) {
		e.preventDefault();

		// 同级项自动折叠(accordion)
		if ($(this).hasClass("collapsed")) {
			var $other_in = $(this).parent().siblings().children('ul.in, ul.collapsing');
			$other_in.collapse('hide');
			$other_in.prev('a').addClass('collapsed');
		}

		$(this).toggleClass('collapsed');
		$(this).next('ul').collapse('toggle');
	});

	// 侧边栏的说明无需 id 即可折叠
	$('#side-accordion [data-toggle="collapse-accordion"]').on('click', function(e) {
		e.preventDefault();

		// 同级项自动折叠(accordion)
		var $this_collapse = $(this).parent().parent().next('div.panel-collapse');
		if (!$this_collapse.hasClass("in")) {
			$this_collapse.parent().siblings().children('div.in, div.collapsing').collapse('hide');
		}

		$this_collapse.collapse('toggle');
	});

});
