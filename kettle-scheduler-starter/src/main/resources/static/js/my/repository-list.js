$(document).ready(function () {
	// 加载资源库列表
    getRepositoryList();

    window.actionEvents = {
        'click #edit' : function(e, value, row, index) {
            var repositoryId = row.repositoryId;
            location.href = "view/repository/editUI.shtml?repositoryId=" + repositoryId;
        },
        'click #delete' : function(e, value, row, index) {
            layer.confirm('确定删除该单位？', {
                    btn: ['确定', '取消']
                },
                function(index){
                    layer.close(index);
                    $.ajax({
                        type: 'POST',
                        async: true,
                        url: 'repository/database/delete.shtml',
                        data: {
                            "repositoryId": row.repositoryId
                        },
                        success: function (data) {
                            location.replace(location.href);
                        },
                        error: function () {
                            alert("系统出现问题，请联系管理员");
                        },
                        dataType: 'json'
                    });
                },
                function(){
                    layer.msg('取消操作');
                }
            );
        }
    };
});

function getRepositoryList() {
    $('#repositoryList').bootstrapTable({
        url: '/sys/repository/findRepListByPage',            //请求后台的URL（*）
        method: 'POST',            //请求方式（*）
        toolbar: '#toolbar',        //工具按钮用哪个容器
        striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sortable: false,                     //是否启用排序
        sortOrder: "asc",                   //排序方式
        queryParams: JSON.stringify(queryParams()),//传递参数（*）
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [5, 25, 50, 100],        //可供选择的每页的行数（*）
        search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: false,
        showColumns: true,                  //是否显示所有的列
        showRefresh: false,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        // height: 500,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "id",                     //每一行的唯一标识，一般为主键列
        showToggle: false,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        responseHandler: function(res) {
            return {
                "total": res.result.totalPages,//总页数
                "rows": res.result.content//数据列表
            };
        },
        columns: [
            {
                field: 'id',
                title: '资源库编号'
            }, {
                field: 'repName',
                title: '资源库名称'
            }, {
                field: 'repType',
                title: '资源库类型'
            }, {
                field: 'repBasePath',
                title: '文件资源库路径'
            }, {
                field: 'dbHost',
                title: '数据库主机名或者IP地址'
            }, {
                field: 'dbName',
                title: '资源库数据库名称'
            },{
                field: 'operate',
                title: '操作',
                width: 150,
                align: 'center',
                valign: 'middle',
                formatter: actionFormatter
            }]
    });
}

function queryParams() {
    return  {
        page: {
            size: 10,
            number: 1
        }
    };
}

function actionFormatter(value, row, index) {
    return [
        '<a class="btn btn-primary btn-xs" id="edit" type="button"><i class="fa fa-edit" aria-hidden="true"></i>&nbsp;编辑</a>',
        '&nbsp;&nbsp;',
        '<a class="btn btn-primary btn-xs" id="delete" type="button"><i class="fa fa-trash" aria-hidden="true"></i>&nbsp;删除</a>'
    ].join('');
}

