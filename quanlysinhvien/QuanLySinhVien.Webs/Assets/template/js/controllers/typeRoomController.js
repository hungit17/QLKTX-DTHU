var config = {
    pageSize: 20,
    pageIndex: 1
}
var typeRoomController = {
    init: function () {
        typeRoomController.loadData();
        typeRoomController.registerEvent();
    },
    registerEvent: function () {

        $('#frmSaveData').validate({
            rules: {
                TypeRoomName: "required"
            },
            messages: {
                TypeRoomName: "Yêu cầu tên loại phòng"
            }
        });

        $('#btnSave').off('click').on('click', function () {
            var Name = $('#txtTypeRoomName').val();
            var id = $('#txtId').val();
            if ($('#frmSaveData').valid()) {
                if (id !== '') {
                    typeRoomController.Put();
                } else {
                    typeRoomController.checkExist(Name);
                }
            }
        });

        $('#btnAddNew').off('click').on('click', function () {
            typeRoomController.resetForm();
            $('#modal-title').html("Thêm mới loại phòng");
            $('#btnSave').html("Thêm mới");
            $('#modalTypeRoom').modal('show');
        });

        $('.btn-edit').off('click').on('click', function () {

            $('#modal-title').html("Chỉnh sửa nội dung");
            $('#btnSave').html("Chỉnh sửa");
            var id = $(this).data('id');
            $('#modalTypeRoom').modal('show');
            typeRoomController.resetForm();
            typeRoomController.loadDetail(id);
        });
        $("#txtTypeRoomName").on('keypress', function () {
            if ($(this).val().length > 10) {
                toastr.error("Yêu cầu tối đa 10 ký tự");
                return false;
            }

        });
        $('.btn-delete').off('click').on('click', function () {
            var id = $(this).data('id');
            bootbox.confirm("Bạn có chắc chắn muốn xóa loại phòng này không?", function (result) {
                if (result) {
                    typeRoomController.delete(id);
                };

            });
        });
    },
    delete: function (id) {
        $.ajax({
            url: '/TypeRoom/Delete',
            data: { id: id },
            type: 'post',
            dataType: 'json',
            success: function (res) {
                toastr.success(res.message);
                typeRoomController.loadData(true);
            }
        });
    },

    resetForm: function () {
        $('#txtId').val('');
        $('#txtTypeRoomName').val('');
    },
    checkExist: function (Name) {
        var result = false;
        $.ajax({
            url: '/TypeRoom/CheckExist',
            data: {
                name: Name
            },
            type: 'get',
            dataType: 'json',
            success: function (response) {
                if (response.result === true) {
                    typeRoomController.Post();
                } else {
                    $('.validate').html('Tên loại phòng  ' + Name + ' đã tồn tại!');
                }
            }
        });
    },
    loadDetail: function (id) {
        $.ajax({
            url: '/TypeRoom/GetDetail',
            data: {
                id: id
            },
            type: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.status === true) {
                    var item = res.data;
                    $('#txtId').val(item.MaLoaiPhong);
                    $('#txtTypeRoomName').val(item.TenLoaiPhong);
                    
                }
                else {
                    toastr.error(res.message);
                    typeRoomController.loadData(true);
                }
            }

        });
    },
    Post: function () {
        var TenLoaiPhong = $('#txtTypeRoomName').val();
        var e = {
            TenloaiPhong: TenLoaiPhong        };
        $.ajax({
            url: '/TypeRoom/Post',
            data: {
                typeRoom: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#modalTypeRoom').modal('hide');
                    toastr.success(response.message);
                    typeRoomController.loadData(true);
                } else {
                    $('#modalTypeRoom').modal('hide');
                    toastr.error(response.message);
                }
            }
        });
    },
    Put: function () {

        var id = $("#txtId").val();
        var TenLoaiPhong = $('#txtTypeRoomName').val();
        

        var e = {
            MaLoaiPhong: id,
            TenLoaiPhong: TenLoaiPhong
        };
        $.ajax({
            url: '/TypeRoom/Put',
            data: {
                typeRoom: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#modalTypeRoom').modal('hide');
                    toastr.success(response.message);
                    typeRoomController.loadData(true);
                } else {
                    $('#modalTypeRoom').modal('hide');
                    toastr.error(response.message);
                }
            }
        });
    },

    loadData: function (changePageSize) {
        var index = 0;
        $.ajax({
            url: '/TypeRoom/GetAll',
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    var html = '';
                    var template = $('#data-template').html();
                    $.each(data, function (i, item) {
                        html += Mustache.render(template, {
                            ID: item.MaLoaiPhong,
                            IDIndex: index++,
                            TenLoaiPhong: item.TenLoaiPhong
                        });
                    });
                    $('#tbData').html(html);
                    typeRoomController.registerEvent();
                }
            }
        });
    }
}
typeRoomController.init();