var config = {
    pageSize: 20,
    pageIndex: 1
}
var billController = {
    init: function () {
        billController.loadData();
        billController.ChuaThanhToan();
        billController.loadRoomList();
        billController.registerEvent();
    },
    registerEvent: function () {

        $('#frmSaveData').validate({
            rules: {
                CreatedDate:"required",
                ExpiredDate:"required"
            },
            messages: {
                CreatedDate: "Yêu cầu phải nhập ngày lập hóa đơn",
                ExpiredDate: "Yêu cầu phải nhập ngày hết hạn"
            }
        });

        $('#btnSave').off('click').on('click', function () {
            var id = $('#txtId').val();
            if ($('#frmSaveData').valid()) {
                if (id !== '') {
                    billController.Put();
                } else {
                    billController.Post();
                }
            }
        });

        $('#btn-AddNew').off('click').on('click', function () {
            if ($('#frmSaveData').valid()) {
                billController.Post();
            }
        });

        $('.btn-Pay').off('click').on('click', function () {
            var id = $(this).data('id');
            bootbox.confirm("Xác nhận thanh toán hóa đơn phòng này?", function (result) {
                if (result) {
                    billController.ChangeStatus(id);
                };

            });
        });
        $('.btn-delete').off('click').on('click', function () {
            var id = $(this).data('id');
            bootbox.confirm("Bạn có chắc chắn muốn xóa danh mục này không?", function (result) {
                if (result) {
                    billController.delete(id);
                };

            });
        });
        $('#btn-SaveBillData').off('click').on('click', function () {
            bootbox.confirm("Bạn có chắc chắn muốn lưu dữ liệu này không?", function (result) {
                if (result)
                    billController.SaveData();
            });

        });
        $('#btn-Deletemulti').off('click').on('click', function () {
            bootbox.confirm("Bạn có chắc muốn xóa các bản ghi được chọn không?", function (result) {
                if (result)
                    billController.deleteMul();
            });

        });
        $('#txtSearch').change(function () {
            billController.loadData(true);
        });


        $('#btn-refresh').off('click').on('click', function () {
            $('#txtSearch').val('');
            billController.loadData(true);
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
                url: '/bills/ExportExcel',
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
                url: '/bills/GetDetail',
                data: {
                    id: id
                },
                type: 'GET',
                dataType: 'json',
                success: function (res) {
                    if (res.status === true) {
                        var item = res.data;
                        $('#txt_Avatar').attr('src', item.Avatar);
                        $('#largeModalLabel').html("Thông tin sinh viên " + item.Name)
                        $('#txt_Name').html("Họ và tên: " + item.Name);
                        $('#txt_Avatar').html(item.Avatar);
                        $('#txt_Address').html("Địa chỉ: " + item.Address);
                        $('#txt_Gender').html(item.Gender == 1 ? "Giới tính: Nam" : (item.Gender == 0 ? "Giới tính: Nữ" : "Giới tính: Khác"));
                        $('#txt_PhoneNumber').html("Điện thoại: " + item.PhoneNumber);
                        $('#txt_BirthDay').html("Ngày sinh: " + sharedController.standartDate(item.BirthDay));

                    }
                    else {
                        toastr.error(res.message);
                        billController.loadData(true);
                    }
                    $('#viewbill').modal('show');
                }

            });
        });
    },
    delete: function (id) {
        $.ajax({
            url: '/Bill/Delete',
            data: { id: id },
            type: 'post',
            dataType: 'json',
            success: function (res) {
                toastr.success(res.message);
                billController.loadRoomList();
                billController.loadData(true);

            }
        });
    },
    deleteMul: function () {
        
            $.ajax({
                url: '/Bill/SaveBillData',
                type: 'post',
                dataType: 'json',
                success: function (response) {
                    toastr.success(response.message);
                    billController.loadData(true);
                }
            });
    
    },

    resetForm: function () {
        $('#txtId').val('');
        $('#txtRoomName').val('');
        $('#txtCreatedDate').val('');
        $('#txtCongTorIndex').val('');
        $('#txtPhiThem').val('');
    },

    loadDetail: function (id) {
        $.ajax({
            url: '/Bill/GetDetail',
            data: {
                id: id
            },
            type: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.status === true) {
                    var item = res.data;
                    $('#txtId').val(item.ID);
                    $('#txtRoomName').val(item.RoomName);
                    $('#txtCreatedDate').val(item.CreatedDate);
                    $('#txtCongTorIndex').val(item.CongTorIndex);
                    $('#txtPhiThem').val(item.PhiThem);

                }
                else {
                    toastr.error(res.message);
                    billController.loadData(true);
                }
            }

        });
    },
    loadRoomList: function () {
        $('#txtRoomList').children().remove();
        var listOption = $('#txtRoomList');
        $.ajax({
            url: '/Bill/loadRoomList',
            type: 'get',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    $(data).each(function (i, item) {
                        listOption.append($('<option/>', { value: item.ID, text: item.RoomName }));
                    });
                }
            }
        });
    },
    Post: function () {
        var RoomID = $('#txtRoomList').val();
        var CreatedDate = $('#txtCreatedDate').val();
        var ExpiredDate = $('#txtExpiredDate').val();

        $.ajax({
            url: '/Bill/Post',
            data: {
                roomID: RoomID,
                CreatedDate: CreatedDate,
                ExpiredDate: ExpiredDate
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {

                    toastr.success(response.message);
                    billController.loadRoomList();
                    billController.loadData(true);
                } else {
                    toastr.error(response.message);
                }
            }
        });
    },
    ChangeStatus: function (id) {
      
        $.ajax({
            url: '/Bill/ChangeStatus',
            data: {
                id: id
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    toastr.info(response.message);
                    billController.loadData(true);
                } else {
                    toastr.error(response.message);
                }
            }
        });
    },
    ChuaThanhToan: function () {
        $.ajax({
            url: '/Bill/ChuaThanhToan',
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    var html = '';
                    if (data.length == 0) {
                        $('#notifi').text("Tất cả các phòng đều đã thanh toán tiền");
                    } else {
                        var template = $('#data-DontBill').html();
                        $.each(data, function (i, item) {
                            html += Mustache.render(template, {
                                ID: item.ID,
                                RoomName: item.RoomName,
                                CreatedDate: sharedController.parseDate(item.CreatedDate),
                                TienDien: sharedController.formatNumber(item.TienDien, '.', ','),
                                TienNuoc: sharedController.formatNumber(item.TienNuoc, '.', ','),
                                TongTien: sharedController.formatNumber(item.TongTien, '.', ','),
                                ThanhToan: item.Status == false ? "<span class='col-red'>Chưa thanh toán</span>" : "<span class='col-green'>Đã thanh toán</span>"
                            });
                        });
                        $('#tbDontBill').html(html);
                    }
                }
            }
        });
    },
    loadData: function (changePageSize) {
        var createdDate = $('#txtCreatedDate').val(sharedController.standartDate(Date.now()));
        var search = $('#txtSearch').val();
        $.ajax({
            url: '/Bill/GetAll',
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
                            RoomName: item.RoomName,
                            CreatedDate: sharedController.parseDate(item.CreatedDate),
                            TienDien: sharedController.formatNumber(item.TienDien,'.',','),
                            TienNuoc: sharedController.formatNumber(item.TienNuoc, '.', ','),
                            TongTien: sharedController.formatNumber(item.TongTien, '.', ','),
                            ThanhToan: item.Status == false ? "<span class='col-red'>Chưa thanh toán</span>" :"<span class='col-green'>Đã thanh toán</span>"
                        });
                    });
                    $('#tbData').html(html);
                    var totalPage = Math.ceil(response.total / config.pageSize);
                    billController.paging(response.total, function () {

                        billController.loadData();
                        $('#currentpage').html(config.pageIndex);
                        $('#totalpage').html(totalPage);
                    }, changePageSize);
                    billController.registerEvent();
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
billController.init();