var config = {
    pageSize: 20,
    pageIndex: 1
}
var congtoDienController = {
    init: function () {
        congtoDienController.loadData();
        congtoDienController.registerEvent();
    },
    registerEvent: function () {

        $('#frmSaveData').validate({
            rules: {
                MaCongTo: "required"
            },
            messages: {
                MaCongTo: "Yêu cầu nhập mã công tơ"
            }
        });
        $('#btn-AddNew').off('click').on('click', function () {
            var name = $('#txtCongToCode').val();
            if ($('#frmSaveData').valid()) {
                congtoDienController.CheckExist(name);
            }
        });

        $('#btnAddNew').off('click').on('click', function () {
            congtoDienController.resetForm();
            $('#modal-title').html("Thêm mới công tơ nước");
            $('#btnSave').html("Thêm mới");
            $('#modalCongTo').modal('show');
        });

        $('.btn-save').off('click').on('click', function () {
            var id = $(this).data('id');
            congtoDienController.Put(id);
        });
        $('.btn-delete').off('click').on('click', function () {
            var id = $(this).data('id');
            bootbox.confirm("Bạn có chắc chắn muốn xóa danh mục này không?", function (result) {
                if (result) {
                    congtoDienController.delete(id);
                };

            });
        });
       
        $('#txtSearch').change(function () {
            congtoDienController.loadData(true);
        });


        $('#btn-refresh').off('click').on('click', function () {
            $('#txtSearch').val('');
            congtoDienController.loadData(true);
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
                url: '/CongtoDien/ExportExcel',
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
            url: '/CongtoDien/Delete',
            data: { id: id },
            type: 'post',
            dataType: 'json',
            success: function (res) {
                toastr.success(res.message);
                congtoDienController.loadData(true);
            }
        });
    },
    deleteMul: function () {
        var listSelected = [];

        $("td input:checked").each(function () {
            listSelected.push($(this).data('id'));

        });
        if (listSelected.length === 0) {
            toastr.warning("Không có phần tử nào được chọn!");
        } else {
            $.ajax({
                url: '/CongtoDien/DeleteMul',
                data: {
                    ids: listSelected
                },
                type: 'post',
                dataType: 'json',
                success: function (response) {
                    toastr.success(response.message);
                    congtoDienController.loadData(true);
                }
            });
        }
    },
    CheckExist: function (name) {
        $.ajax({
            url: '/CongToDien/CheckExist',
            data: { id: name },
            type: 'get',
            dataType: 'json',
            success: function (res) {
                if (res.result === true) {
                    congtoDienController.Post();
                } else {
                    $('.validate').html('Mã  ' + name + ' đã tồn tại!');
                    toastr.error("Tên " + name + " đã tồn tại!");
                }
            }
        });
    },
    resetForm: function () {
        $('#txtId').val('');
        $('#txtCongToCode').val('');
        $('#txtChiSoCu').val('1,00');
        $('#txtChiSoMoi').val('1,00');
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
            url: '/CongToDien/Post',
            data: {
                CongToDien: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#modalCongTo').modal('hide');
                    toastr.success(response.message);
                    congtoDienController.resetForm();
                    congtoDienController.loadData(true);
                } else {
                    $('#modalCongTo').modal('hide');
                    toastr.error(response.message);
                }
            }
        });
    },
    Put: function (id) {  
        var MaSoCongTo = $('#txtMaCongTo-'+id).val();
        var ChiSoCu = $('#txtOldIndex-'+id).val();
        var ChiSoMoi = $('#txtNewIndex-'+id).val();

        var e = {
            ID: id,
            MaSoCongTo: MaSoCongTo,
            ChiSoCu: ChiSoCu,
            ChiSoMoi: ChiSoMoi
        };
        $.ajax({
            url: '/CongToDien/Put',
            data: {
                CongToDien: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    toastr.success(response.message);
                    congtoDienController.loadData(true);
                } else {
                    toastr.error(response.message);
                }
            }
        });
    },

    loadData: function (changePageSize) {
        var search = $('#txtSearch').val();
        $.ajax({
            url: '/CongtoDien/GetAll',
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
                            MaSoCongTo: item.MaSoCongTo,
                            ChiSoCu: item.ChiSoCu,
                            ChiSoMoi: item.ChiSoMoi,
                            TieuThu:item.TieuThu,
                            TongTien: item.TongTien === null ? "-" : sharedController.formatNumber(item.TongTien, '.', ',')
                        });
                    });
                    $('#tbData').html(html);
                    var totalPage = Math.ceil(response.total / config.pageSize);
                    congtoDienController.paging(response.total, function () {

                        congtoDienController.loadData();
                        $('#currentpage').html(config.pageIndex);
                        $('#totalpage').html(totalPage);
                    }, changePageSize);
                    congtoDienController.registerEvent();
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
congtoDienController.init();