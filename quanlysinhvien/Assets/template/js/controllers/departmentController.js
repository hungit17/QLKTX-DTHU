var config = {
    pageSize: 20,
    pageIndex: 1
}
var departmentController = {
    init: function () {
        departmentController.loadData();
        departmentController.registerEvent();
    },
    registerEvent: function () {

        $('#frmSaveData').validate({
            rules: {
                DepartmentCode: "required",
                DepartmentName: "required"
            },
            messages: {

                DepartmentCode: "Yêu cầu nhập mã khoa",
                DepartmentName: "Yêu cầu nhập tên khoa"

            }
        });

        $('#btnSave').off('click').on('click', function () {
            var Name = $('#txtDepartmentCode').val();
            var id = $('#txtId').val();
            if ($('#frmSaveData').valid()) {
                if (id !== '') {
                    departmentController.Put();
                } else {
                    departmentController.checkExist(Name);
                }
            }
        });
       
        $('#btnAddNew').off('click').on('click', function () {
            departmentController.resetForm();
            $('#modal-title').html("Thêm mới khoa");
            $('#btnSave').html("Thêm mới");
            $('#modalDepartment').modal('show');
        });

        $('.btn-edit').off('click').on('click', function () {

            $('#modal-title').html("Chỉnh sửa nội dung");
            $('#btnSave').html("Chỉnh sửa");
            var id = $(this).data('id');
            $('#modalDepartment').modal('show');
            departmentController.resetForm();
            departmentController.loadDetail(id);
        });
        $('.btn-delete').off('click').on('click', function () {
            var id = $(this).data('id');
            bootbox.confirm("Bạn có chắc chắn muốn xóa khoa này không?", function (result) {
                if (result) {
                    departmentController.delete(id);
                };

            });
        });
        $('#btn-Deletemulti').off('click').on('click', function () {
            bootbox.confirm("Bạn có chắc muốn xóa các bản ghi được chọn không?", function (result) {
                if (result)
                    departmentController.deleteMul();
            });

        });
        $('#txtSearch').change(function () {
            departmentController.loadData(true);
        });
        

        $('#btn-refresh').off('click').on('click', function () {
            $('#txtSearch').val('');
            departmentController.loadData(true);
        });

        $('#selectAll').change(function () {
            $('.selectedItem').prop('checked', $(this).prop('checked'));
            $('#btn-Deletemulti').removeAttr('disabled');
        });
        $('.selectedItem').on('click', function () {
            $(this).attr('checked', this.checked ? '' : 'checked');
            $('#btn-Deletemulti').removeAttr('disabled');
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
                url: '/Department/ExportExcel',
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
                url: '/Department/GetDetail',
                data: {
                    id: id
                },
                type: 'GET',
                dataType: 'json',
                success: function (res) {
                    if (res.status === true) {
                        var item = res.data;

                        $('#txt_DepartmentCode').html("Mã khoa: " + item.DepartmentCode);
                        $('#txt_DepartmentName').html("Tên khoa: " + item.DepartmentName);
                      
                    }
                    else {
                        toastr.error(res.message);
                        departmentController.loadData(true);
                    }
                    $('#viewDepartment').modal('show');
                }

            });
        });
    },
    delete: function (id) {
        $.ajax({
            url: '/Department/Delete',
            data: { id: id },
            type: 'post',
            dataType: 'json',
            success: function (res) {
                toastr.success(res.message);
                departmentController.loadData(true);
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
                url: '/Department/DeleteMul',
                data: {
                    ids: listSelected
                },
                type: 'post',
                dataType: 'json',
                success: function (response) {
                    toastr.success(response.message);
                    departmentController.loadData(true);
                }
            });
        }
    },

    resetForm: function () {
        $('#txtId').val('');
        $('#txtDepartmentName').val('');
        $('#txtDepartmentCode').val('');
        },
    checkExist: function (Name) {
        var result = false;
        $.ajax({
            url: '/Department/CheckExist',
            data: {
                name: Name
            },
            type: 'get',
            dataType: 'json',
            success: function (response) {
                if (response.result === true) {
                    departmentController.Post();
                } else {
                    $('.validate').html('Mã khoa ' + Name + ' đã tồn tại!');
                }
            }
        });
    },
    loadDetail: function (id) {
        $.ajax({
            url: '/Department/GetDetail',
            data: {
                id: id
            },
            type: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.status === true) {
                    var item = res.data;
                    $('#txtId').val(item.ID);
                    $('#txtDepartmentName').val(item.DepartmentName);
                    $('#txtDepartmentCode').val(item.DepartmentCode);
                    
                }
                else {
                    toastr.error(res.message);
                    departmentController.loadData(true);
                }
            }

        });
    },
    Post: function () {
        var DepartmentName = $('#txtDepartmentName').val();
        var DepartmentCode = $('#txtDepartmentCode').val();
        
        var e = {
            DepartmentName: DepartmentName,
            DepartmentCode: DepartmentCode
        };
        $.ajax({
            url: '/Department/Post',
            data: {
                department: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#modalDepartment').modal('hide');
                    toastr.success(response.message);
                    departmentController.loadData(true);
                } else {
                    $('#modalDepartment').modal('hide');
                    toastr.error(response.message);
                }
            }
        });
    },
    Put: function () {

        var id = $("#txtId").val();
        var DeparmentName = $('#txtDepartmentName').val();
        var DepartmentCode = $('#txtDepartmentCode').val();
        

        var e = {
            ID: id,
            DepartmentName: DeparmentName,
            DepartmentCode: DepartmentCode
        };
        $.ajax({
            url: '/Department/Put',
            data: {
                department: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#modalDepartment').modal('hide');
                    toastr.success(response.message);
                    departmentController.loadData(true);
                } else {
                    $('#modalDepartment').modal('hide');
                    toastr.error(response.message);
                }
            }
        });
    },

    loadData: function (changePageSize) {
        var search = $('#txtSearch').val();
        $.ajax({
            url: '/Department/GetAll',
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
                            DepartmentName: item.DepartmentName,
                            DepartmentCode: item.DepartmentCode

                        });
                    });
                    $('#tbData').html(html);
                    var totalPage = Math.ceil(response.total / config.pageSize);
                    departmentController.paging(response.total, function () {

                        departmentController.loadData();
                        $('#currentpage').html(config.pageIndex);
                        $('#totalpage').html(totalPage);
                    }, changePageSize);
                    departmentController.registerEvent();
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
departmentController.init();