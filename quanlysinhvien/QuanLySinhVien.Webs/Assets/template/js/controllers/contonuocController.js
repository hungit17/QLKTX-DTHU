var config = {
    pageSize: 20,
    pageIndex: 1
}
var congtonuocController = {
    init: function () {
        congtonuocController.loadData();
        congtonuocController.registerEvent();
    },
    registerEvent: function () {

        $('#frmSaveData').validate({
            rules: {
                MaCongTo:"required"
            },
            messages: {
                MaCongTo:"Yêu cầu nhập mã công tơ"
            }
        });
        $('#btnSave').off('click').on('click', function () {
            var name = $('#txtCongToCode').val();
            var id = $('#txtId').val();
            if ($('#frmSaveData').valid()) {
                if (id !== '') {
                    congtonuocController.Put();
                } else {
                    congtonuocController.CheckExist(name);
                }
            }
        });
 
        $('#btnAddNew').off('click').on('click', function () {
            congtonuocController.resetForm();
            $('#modal-title').html("Thêm mới công tơ nước");
            $('#btnSave').html("Thêm mới");
            $('#modalCongTo').modal('show');
        });

        $('.btn-edit').off('click').on('click', function () {

            $('#modal-title').html("Chỉnh sửa nội dung");
            $('#btnSave').html("Chỉnh sửa");
            var id = $(this).data('id');
            $('#modalCongTo').modal('show');
            congtonuocController.resetForm();
  
            congtonuocController.loadDetail(id);
        });
        $('.btn-delete').off('click').on('click', function () {
            var id = $(this).data('id');
            bootbox.confirm("Bạn có chắc chắn muốn xóa danh mục này không?", function (result) {
                if (result) {
                    congtonuocController.delete(id);
                };

            });
        });
        $('#btn-Deletemulti').off('click').on('click', function () {
            bootbox.confirm("Bạn có chắc muốn xóa các bản ghi được chọn không?", function (result) {
                if (result)
                    congtonuocController.deleteMul();
            });

        });
        $('#txtSearch').change(function () {
            congtonuocController.loadData(true);
        });


        $('#btn-refresh').off('click').on('click', function () {
            $('#txtSearch').val('');
            congtonuocController.loadData(true);
        });

        $('#selectAll').change(function () {
            $('.selectedItem').prop('checked', $(this).prop('checked'));
        });
        $('.selectedItem').on('click', function () {
            $(this).attr('checked', this.checked ? '' : 'checked')
        });

        $('.selectedItem').change(function () {
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

                options: {}
            });
        });

        $("#btnExportExcel").click(function (e) {
            e.preventDefault();
            $.ajax({
                url: '/Congtonuoc/ExportExcel',
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
      
    },
    delete: function (id) {
        $.ajax({
            url: '/Congtonuoc/Delete',
            data: { id: id },
            type: 'post',
            dataType: 'json',
            success: function (res) {
                toastr.success(res.message);
                congtonuocController.loadData(true);
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
                url: '/Congtonuoc/DeleteMul',
                data: {
                    ids: listSelected
                },
                type: 'post',
                dataType: 'json',
                success: function (response) {
                    toastr.success(response.message);
                    congtonuocController.loadData(true);
                }
            });
        }
    },
    CheckExist: function (name) {
        $.ajax({
            url: '/CongToNuoc/CheckExist',
            data: { id: name },
            type: 'get',
            dataType: 'json',
            success: function (res) {
                if (res.result === true) {
                    congtonuocController.Post();
                } else {
                    $('.validate').html('Mã  ' + name + ' đã tồn tại!');
                }
            }
        });
    },
    resetForm: function () {
        $('#txtId').val('');
        $('#txtCongToCode').val('');
        $('#txtChiSoCu').val('0');
        $('#txtChiSoMoi').val('0');
    },
    loadDetail: function (id) {
        $.ajax({
            url: '/Congtonuoc/GetDetail',
            data: {
                id: id
            },
            type: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.status === true) {
                    var item = res.data;
                    $('#txtId').val(item.ID);
                    $('#txtChiSoCu').val(item.ChiSoCu);
                    $('#txtChiSoMoi').val(item.ChiSoMoi);
                    $('#txtCongToCode').val(item.MaSoCongTo);
                }
                else {
                    toastr.error(res.message);
                    congtonuocController.loadData(true);
                }
            }

        });
    },
 
    Post: function () {
        var MaSoCongTo = $('#txtCongToCode').val();
        var ChiSoMoi = $('#txtChiSoMoi').val();
        var ChiSoCu = $('#txtChiSoCu').val();

        var e = {
            MaSoCongTo: MaSoCongTo,
            ChiSoCu: ChiSoCu,
            ChiSoMoi: ChiSoMoi
        };

        $.ajax({
            url: '/CongToNuoc/Post',
            data: {
                CongToNuoc: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#modalCongTo').modal('hide');
                    toastr.success(response.message);
                    congtonuocController.loadData(true);
                } else {
                    $('#modalCongTo').modal('hide');
                    toastr.error(response.message);
                }
            }
        });
    },
    Put: function () {

        var id = $("#txtId").val();
        var MaSoCongTo = $('#txtCongToCode').val();
        var ChiSoMoi = $('#txtChiSoMoi').val();
        var ChiSoCu = $('#txtChiSoCu').val();
        
        var e = {
            ID: id,
            MaSoCongTo: MaSoCongTo,
            ChiSoCu: ChiSoCu,
            ChiSoMoi: ChiSoMoi
        };
        $.ajax({
            url: '/CongToNuoc/Put',
            data: {
                CongToNuoc: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#modalCongTo').modal('hide');
                    toastr.success(response.message);
                    congtonuocController.loadData(true);
                } else {
                    $('#modalCongTo').modal('hide');
                    toastr.error(response.message);
                }
            }
        });
    },

    loadData: function (changePageSize) {
        var search = $('#txtSearch').val();
        $.ajax({
            url: '/Congtonuoc/GetAll',
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
                            RoomName:item.RoomName,
                            MaSoCongTo: item.MaSoCongTo,
                            ChiSoCu: item.ChiSoCu,
                            ChiSoMoi: item.ChiSoMoi
                        });
                    });
                    $('#tbData').html(html);
                    var totalPage = Math.ceil(response.total / config.pageSize);
                    congtonuocController.paging(response.total, function () {

                        congtonuocController.loadData();
                        $('#currentpage').html(config.pageIndex);
                        $('#totalpage').html(totalPage);
                    }, changePageSize);
                    congtonuocController.registerEvent();
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
congtonuocController.init();