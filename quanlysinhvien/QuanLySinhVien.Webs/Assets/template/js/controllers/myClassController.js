var config = {
    pageSize: 20,
    pageIndex: 1
}
var myClassController = {
    init: function () {
        myClassController.loadDepartmentList();
        myClassController.loadData();
        myClassController.registerEvent();
    },
    registerEvent: function () {

        $('#frmSaveData').validate({
            rules: {
                Code:"required",
                Name: "required",
                Department:"required"
            },
            messages: {
                Code:"Mã lớp là bắt buộc",
                Name: "Tên là bắt buộc",
                Department: "Bắt buộc nhập mã khoa"

            }
        });

        $('#btnSave').off('click').on('click', function () {
            var code = $('#txtClassCode').val();
            var id = $('#txtId').val();
            if ($('#frmSaveData').valid()) {
                if (id !== '') {
                    myClassController.Put();
                } else {
                    myClassController.checkExist(code);
                }
            }
        });

        $('#btnAddNew').off('click').on('click', function () {
            myClassController.resetForm();
            $('#modal-title').html("Thêm mới lớp");
            $('#btnSave').html("Thêm mới");
            $('#modalmyClass').modal('show');
        });

        $('.btn-edit').off('click').on('click', function () {

            $('#modal-title').html("Chỉnh sửa nội dung");
            $('#btnSave').html("Chỉnh sửa");
            var id = $(this).data('id');
            $('#modalmyClass').modal('show');
            myClassController.resetForm();
            myClassController.loadDetail(id);
        });
        $('.btn-delete').off('click').on('click', function () {
            var id = $(this).data('id');
            bootbox.confirm("Bạn có chắc chắn muốn xóa danh mục này không?", function (result) {
                if (result) {
                    myClassController.delete(id);
                };

            });
        });
        $('#btn-Deletemulti').off('click').on('click', function () {
            bootbox.confirm("Bạn có chắc muốn xóa các bản ghi được chọn không?", function (result) {
                if (result)
                    myClassController.deleteMul();
            });

        });
        $('#txtSearch').change(function () {
            myClassController.loadData(true);
        });
      
        $('#btn-refresh').off('click').on('click', function () {
            $('#txtSearch').val('');
            myClassController.loadData(true);
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
                url: '/MyClass/ExportExcel',
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
                url: '/MyClass/GetDetail',
                data: {
                    id: id
                },
                type: 'GET',
                dataType: 'json',
                success: function (res) {
                    if (res.status === true) {
                        var item = res.data;
                        $('#largeModalLabel').html("Thông tin lớp " + item.ClassName)
                        $('#txt_ClassCode').html("Mã Lớp: "+item.ClassCode);
                        $('#txt_ClassName').html("Tên Lớp: "+item.ClassName);
                     
                    }
                    else {
                        toastr.error(res.message);
                        myClassController.loadData(true);
                    }
                    $('#viewmyClass').modal('show');
                }

            });
        });
    },
    delete: function (id) {
        $.ajax({
            url: '/MyClass/Delete',
            data: { id: id },
            type: 'post',
            dataType: 'json',
            success: function (res) {
                toastr.success(res.message);
                myClassController.loadData(true);
            }
        });
    },
    loadDepartmentList: function () {
        var selectList = $('#txtDepartmentList');
        $.ajax({
            url: '/MyClass/LoadDepartmentList',
            type: 'get',
            dataType: 'json',
            success: function (res) {
                if (res.status == true) {
                    var data = res.data;
                    $(data).each(function (i, item) {
                        selectList.append($('<option/>', { value: item.ID, text: item.DepartmentName }));
                    })
                }
            }
        })
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
                url: '/MyClass/DeleteMul',
                data: {
                    ids: listSelected
                },
                type: 'post',
                dataType: 'json',
                success: function (response) {
                    toastr.success(response.message);
                    myClassController.loadData(true);
                }
            });
        }
    },

    resetForm: function () {
        $('#txtId').val('');
        $('#txtClassCode').val('');
        $('#txtClassName').val('');
    },
    checkExist: function (Name) {
        var result = false;
        $.ajax({
            url: '/MyClass/CheckExist',
            data: {
                name: Name
            },
            type: 'get',
            dataType: 'json',
            success: function (response) {
                if (response.result === true) {
                    myClassController.Post();
                } else {
                    $('.validate').html('Tên ' + Name + ' đã tồn tại!');
                }
            }
        });
    },
    loadDetail: function (id) {
        $.ajax({
            url: '/MyClass/GetDetail',
            data: {
                id: id
            },
            type: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.status === true) {
                    var item = res.data;
                    $('#txtId').val(item.ID);
                    $('#txtClassCode').val(item.ClassCode);
                    $('#txtClassName').val(item.ClassName);
                    
                }
                else {
                    toastr.error(res.message);
                    myClassController.loadData(true);
                }
            }

        });
    },
    Post: function () {
        var ClassCode = $('#txtClassCode').val();
        var ClassName = $('#txtClassName').val();
        var DepartmentID = $('#txtDepartmentList').val();
        var e = {
            ClassCode: ClassCode,
            ClassName: ClassName,
            DepartmentID: DepartmentID
        };
        $.ajax({
            url: '/MyClass/Post',
            data: {
                myClass: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#modalmyClass').modal('hide');
                    toastr.success(response.message);
                    myClassController.loadData(true);
                } else {
                    $('#modalmyClass').modal('hide');
                    toastr.error(response.message);
                }
            }
        });
    },
    Put: function () {

        var id = $("#txtId").val();
        var ClassCode = $('#txtClassCode').val();
        var ClassName = $('#txtClassName').val();
        var DepartmentID = $('#txtDepartmentList').val();

        var e = {
            ID: id,
            ClassCode: ClassCode,
            ClassName: ClassName,
            DepartmentID: DepartmentID
        };
        $.ajax({
            url: '/myClass/Put',
            data: {
                myClass: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#modalmyClass').modal('hide');
                    toastr.success(response.message);
                    myClassController.loadData(true);
                } else {
                    $('#modalmyClass').modal('hide');
                    toastr.error(response.message);
                }
            }
        });
    },

    loadData: function (changePageSize) {
        var search = $('#txtSearch').val();
        $.ajax({
            url: '/MyClass/GetAll',
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
                            ClassCode: item.ClassCode,
                            ClassName: item.ClassName
                            
                        });
                    });
                    $('#tbData').html(html);
                    var totalPage = Math.ceil(response.total / config.pageSize);
                    myClassController.paging(response.total, function () {

                        myClassController.loadData();
                        $('#currentpage').html(config.pageIndex);
                        $('#totalpage').html(totalPage);
                    }, changePageSize);
                    myClassController.registerEvent();
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
myClassController.init();