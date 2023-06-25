var config = {
    pageSize: 20,
    pageIndex: 1
}
var notificationController = {
    init: function () {
        notificationController.loadData();
        notificationController.registerEvent();
    },
    registerEvent: function () {

        $('#frmSaveData').validate({
            rules: {
                Name: "required",
                CreatedDate: "required",
                ExpireDate:"required"
            },
            messages: {
                Name: "Tên là bắt buộc",
                CreatedDate: "Yêu cầu ngày tạo",
                ExpireDate: "Yêu cầu ngày hết hạn",

            }
        });

        $('#btnSave').off('click').on('click', function () {
            var Name = $('#txtName').val();
            var id = $('#txtId').val();
            if ($('#frmSaveData').valid()) {
                if (id !== '') {
                    notificationController.Put();
                } else {
                    notificationController.checkExist(Name);
                }
            }
        });
  
        $('#btnAddNew').off('click').on('click', function () {
            notificationController.resetForm();
            $('#modal-title').html("Thêm thông báo mới");
            $('#btnSave').html("Thêm mới");
            $('#modalNotification').modal('show');
        });

        $('.btn-edit').off('click').on('click', function () {

            $('#modal-title').html("Chỉnh sửa nội dung");
            $('#btnSave').html("Chỉnh sửa");
            var id = $(this).data('id');
            $('#modalNotification').modal('show');
            notificationController.resetForm();
            notificationController.loadDetail(id);
        });
        $('.btn-delete').off('click').on('click', function () {
            var id = $(this).data('id');
            bootbox.confirm("Bạn có chắc chắn muốn xóa danh mục này không?", function (result) {
                if (result) {
                    notificationController.delete(id);
                };

            });
        });
        $('#btn-Deletemulti').off('click').on('click', function () {
            bootbox.confirm("Bạn có chắc muốn xóa các bản ghi được chọn không?", function (result) {
                if (result)
                    notificationController.deleteMul();
            });

        });
        $('#txtSearch').change(function () {
            notificationController.loadData(true);
        });

        $('#btn-refresh').off('click').on('click', function () {
            $('#txtSearch').val('');
            notificationController.loadData(true);
        });

        $('#selectAll').change(function () {
            $('.selectedItem').prop('checked', $(this).prop('checked'));
        });

        $('.selectedItem').on('click', function () {
            $(this).attr('checked', this.checked ? '' : 'checked')
        });

        $('.selectedItem').on('change', function () {
            var selectedItem = $('.selectedItem').attr('checked').length;
            if (selectedItem > 1) {
                $('#btn-Deletemulti').removeAttr('disabled');
            } else {
                $('#btn-Deletemulti').add('disabled');
            };
        });

        $('#btnShowChart').click(function () {
            var ctx = document.getElementById('myChart').getContext('2d');
            var chart = new Chart(ctx, {
                // The type of chart we want to create
                type: 'bar',

                // The data for our dataset
                data: {
                    labels: ["Cntt01", "Cntt02", "Cntt03", "spmn", "toan", "Vatly", "sinhhoc"],
                    datasets: [{
                        label: "My First dataset",
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgb(255, 99, 132)',
                        data: [120, 130, 15, 322, 120, 430, 45],
                    }]
                },

                // Configuration options go here
                options: {}
            });
        });

        $("#btnExportExcel").click(function (e) {
            e.preventDefault();
            $.ajax({
                url: '/notifications/ExportExcel',
                type: 'post',
                dataType: 'json',
                response: function (res) {
                    if (res.status === true) {
                        toastr.success("Chúc mừng bạn đã xuất thành công!:)");
                    } else {
                        toastr.error("Chúc mừng bạn đã xuất không thành công!:)");
                    }
                }
            })
        });
        $('#printTable').click(function () {
            var print = document.getElementById('tbData');
            var wme = window.open("", "", "width:auto", "height:auto");
            wme.document.write(print.outerHTML);
            wme.document.close();
            wme.focus();
            wme.print();
            wme.close();
        });
        $('.btn-view').click(function () {
            var id = $(this).data('id');
            $.ajax({
                url: '/Notification/GetDetail',
                data: {
                    id: id
                },
                type: 'GET',
                dataType: 'json',
                success: function (res) {
                    if (res.status === true) {
                        var item = res.data;
                        $('#txt_Name').html("Tên thông báo:" + item.Name);
                        $('#txt_Content').html("Nội dung thông báo" + item.Content)
                        $('#txt_CreatedDate').html("Ngày tạo: " + item.CreatedDate);
                        $('#txt_ExpireDate').html("Ngày hết hạn: " + item.ExpireDate);
                        $('#txt_Status').html(item.Status== 1 ? "Trạng thái: Kích hoạt" : "Trạng thái: Hết hạn");
                    }
                    else {
                        toastr.error(res.message);
                        notificationController.loadData(true);
                    }
                    $('#viewNotification').modal('show');
                }

            });
        });
    },
    delete: function (id) {
        $.ajax({
            url: '/Notification/Delete',
            data: { id: id },
            type: 'post',
            dataType: 'json',
            success: function (res) {
                toastr.success(res.message);
                notificationController.loadData(true);
            }
        });
    },
    deleteMul: function () {
        var listSelected = [];

        $("td input:checked").each(function () {
            listSelected.push($(this).data('id'));

        });
        if (listSelected.length == 0) {
            toastr.warning("Không có phần tử nào được chọn!");
        } else {
            $.ajax({
                url: '/Notification/DeleteMul',
                data: {
                    ids: listSelected
                },
                type: 'post',
                dataType: 'json',
                success: function (response) {
                    toastr.success(response.message);
                    notificationController.loadData(true);
                }
            });
        }
    },

    resetForm: function () {
        $('#txtId').val('');
        $('#txtName').val('');
        $('#txtContent').val('');
        $('#txtCreatedDate').val('');
        $('#txtExpireDate').val('');
        $('#txtStatus').prop('checked',true);
    },
    checkExist: function (Name) {
        var result = false;
        $.ajax({
            url: '/Notification/CheckExist',
            data: {
                name: Name
            },
            type: 'get',
            dataType: 'json',
            success: function (response) {
                if (response.result === true) {
                    notificationController.Post();
                } else {
                    $('.validate').html('Tên ' + Name + ' đã tồn tại!');
                }
            }
        });
    },
    loadDetail: function (id) {
        $.ajax({
            url: '/Notification/GetDetail',
            data: {
                id: id
            },
            type: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.status === true) {
                    var item = res.data;
                    $('#txtId').val(item.ID);
                    $('#txtName').val(item.Name);
                    $('#txtContent').val(item.Content);
                    $('#txtCreatedDate').val(item.CreatedDate);
                    $('#txtExpireDate').val(item.ExpireDate);
                    $('#txtStatus').val(item.Status);

                }
                else {
                    toastr.error(res.message);
                    notificationController.loadData(true);
                }
            }

        });
    },
    Post: function () {
        var Name = $('#txtName').val();
        var Content = $('#txtContent').val();
        var CreatedDate = $('#txtCreatedDate').val();
        var ExpireDate = $('#txtExpireDate').val();
        var Status = $('#txtStatus').prop('checked');

        var e = {
            Name: Name,
            Content: Content,
            CreatedDate: CreatedDate,
            ExpireDate: ExpireDate,
            Status: Status
        };
        $.ajax({
            url: '/Notification/Post',
            data: {
                notification: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#modalNotification').modal('hide');
                    toastr.success(response.message);
                    notificationController.loadData(true);
                } else {
                    $('#modalNotification').modal('hide');
                    toastr.error(response.message);
                }
            }
        });
    },
    Put: function () {

        var id = $("#txtId").val();
        var Name = $('#txtName').val();
        var Content = $('#txtContent').val();
        var CreatedDate = $('#txtCreatedDate').val();
        var ExpireDate = $('#txtExpire').val();
        var Status = $('#txtStatus').prop('checked');

        var e = {
            Name: Name,
            Content: Content,
            CreatedDate: CreatedDate,
            ExpireDate: ExpireDate,
            Status: Status
        };
        $.ajax({
            url: '/Notification/Put',
            data: {
                notification: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#modalNotification').modal('hide');
                    toastr.success(response.message);
                    notificationController.loadData(true);
                } else {
                    $('#modalNotification').modal('hide');
                    toastr.error(response.message);
                }
            }
        });
    },

    loadData: function (changePageSize) {
        var search = $('#txtSearch').val();
        $.ajax({
            url: '/Notification/GetAll',
            type: 'GET',
            data: {
                searchstr: search,
                page: config.pageIndex,
                pageSize: config.pageSize
            },
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    var html = '';
                    var template = $('#data-template').html();
                    $.each(data, function (i, item) {
                        html += Mustache.render(template, {
                            ID: item.ID,
                            Name: item.Name,
                            Content: item.Content,
                            Status: item.Status === 1 ? "Kích hoạt" : "Hết hạn",
                            CreatedDate: sharedController.parseDate(item.CreatedDate),
                            ExpireDate: sharedController.parseDate(item.ExpireDate)
                            
                        });
                    });
                    $('#tbData').html(html);
                    var totalPage = Math.ceil(response.total / config.pageSize);
                    notificationController.paging(response.total, function () {

                        notificationController.loadData();
                        $('#currentpage').html(config.pageIndex);
                        $('#totalpage').html(totalPage);
                    }, changePageSize);
                    notificationController.registerEvent();
                }
            }
        });
    },
    paging: function (totalRow, callback, changePageSize) {
        var totalPage = Math.ceil(totalRow / config.pageSize);
        if ($('#pagination a').length === 0 || changePageSize === true) {
            $('#pagination').empty();
            $('#pagination').removeData("twbs-pagination");
            $('#pagination').unbind("page");
        }
        $('#pagination').twbsPagination({
            totalPages: totalPage,
            first: 'Đầu',
            prev: 'Trước',
            next: 'Tiếp ',
            last: 'Cuối',
            visiblePages: 10,
            onPageClick: function (event, page) {
                config.pageIndex = page;
                setTimeout(callback, 200)
            }
        })
    }
}
notificationController.init();