$(document).ready( function() {
	var setting = {
		callback : {
			onClick : function(event, treeId, treeNode) {
				$('#form-data').formData(treeNode);
				var s = typeof treeNode.Status == 'undefined' ? 1 : treeNode.Status;
				$('#sts-status').radioButtonList(status,'Status','Text','Value',s,2);
				
				if(treeNode.id == 0){
					$('input[name="Name"]').val(treeNode.name);
				}else{
					$('input[name="Name"]').val(treeNode.Name.substr(6));
				}
			}
		}
	};
	
	var bindData = function(){
		$('#sts-status').radioButtonList(status,'Status','Text','Value',1,2);
		
		$.get(basePath + 'admin/category/categoryNodes', null, function(data) {
			zTreeObj = $.fn.zTree.init($("#tree-category"), setting, data);
		})

		$('input[name="OrderNum"]').kendoNumericTextBox({
			 format: "#",
			 decimals: 0,
			 min: 1,
			 max:99999999,
			 value:1
		});
	};
	
	$('#btn-add').click( function() {
		var treeObj=$.fn.zTree.getZTreeObj("tree-category"),
			nodes=treeObj.getSelectedNodes();

		if(nodes.length == 0){
			$.mdlg.error('提示','请选择父级分类。')
			return;
		}
		
//		$('#form-data').resetForm();
//		$('#id').val("");
//		$('#parentId').val(nodes[0].Id);
//		$('#stsNormal').prop('checked',true)
		
		var params = $("#form-data").serializeJson();
		delete params.Id;
		$.post(basePath + 'admin/category/save', JSON.stringify(params), function(data) {
			if(data.result == true){
				$.mdlg.alert('提示',data.message);
				$('#form-data').resetForm();
				bindData();
			}else{
				$.mdlg.error('错误',data.message);
			}
		})
	});

	$('#btn-sync').click( function() {
		$.mdlg.confirm('提示','您确认要将分类同步到前段展示么？',function(){
			var params = {};
			$.post(basePath + 'admin/category/sync', JSON.stringify(params), function(data) {
				if(data.result == true){
					$.mdlg.alert('提示',data.message);
					$('#form-data').resetForm();
					bindData();
				}else{
					$.mdlg.error('错误',data.message);
				}
			})

			$('#form-data').resetForm();
			$('#parentId').val(nodes[0].Id);
			$('#stsNormal').prop('checked',true)
		})
	});

	$('#btn-save').click( function() {
		var params = $("#form-data").serializeJson();

		$.post(basePath + 'admin/category/save', JSON.stringify(params), function(data) {
			if(data.result == true){
				$.mdlg.alert('提示',data.message);
				$('#form-data').resetForm();
				bindData();
			}else{
				$.mdlg.error('错误',data.message);
			}
		})
	})

	$('#btn-del').click( function() {
		var treeObj=$.fn.zTree.getZTreeObj("tree-category"),
			nodes=treeObj.getSelectedNodes();
		
		if(nodes.length == 0){
			$.mdlg.error('提示','请选择要删除的记录。')
			return;
		}

		$.mdlg({
			title:'提示',
			content:'确认删除本条记录?',
			showCloseButton:false,
			buttons:["确定","取消"],
			buttonStyles:['btn-success','btn-default'],
			onButtonClick:function(sender,modal,index){
				if(index == 0){
					var params = {Id:nodes[0].Id};
					
					$.post(basePath + 'admin/category/delete',JSON.stringify(params) , function(data) {
						if(data.result == true){
							$.mdlg.alert('提示',data.message);
							$('#form-data').clearForm();
							bindData();
						}else{
							$.mdlg.error('错误',data.message);
						}
					})
				}
				
				$(this).closeDialog(modal);
			}
		})
	})
	
	bindData();
})