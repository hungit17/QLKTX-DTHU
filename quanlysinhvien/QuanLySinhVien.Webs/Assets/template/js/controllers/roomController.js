//var config = {
//    pageSize: 20,
//    pageIndex: 1
//}
//var roomController = {
//    init: function () {
//        roomController.loadCTD();
//        roomController.loadCTN();
//        roomController.loadData();
//        roomController.loadDsPhong();
//        roomController.LoadRoomNameList();
//        roomController.loadRoomList();
//        roomController.loadStudentList();
//        roomController.registerEvent();
//    },
//    registerEvent: function () {

//        $('#frmSaveData').validate({
//            rules: {
//                roomCode: "required",
//                RoomName: "required",
//                MaCTD: "required",
//                MaCTN: "required",

//            },
//            messages: {
//                roomCode: "Yêu cầu nhập mã phòng",
//                RoomName: "Yêu cầu nhập tên phòng",
//                MaCTD: "Yêu cầu nhập mã công tơ điện",
//                MaCTN: "Yêu cầu nhập mã công tơ nước"

//            }
//        });

//        $('#btnSave').off('click').on('click', function () {
//            var Name = $('#txtRoomCode').val();
//            var id = $('#txtId').val();
//            if ($('#frmSaveData').valid()) {
//                if (id !== '') {
//                    roomController.Put();
//                } else {
//                    roomController.checkExist(Name);
//                }
//            }
//        });
//        $('#btnCancle').off('click').on('click', function () {
//            $('#blockList').removeAttr('hidden');
//            $('#blockCreate').attr('hidden','hidden');
//        });
//        $('#btnAddNew').off('click').on('click', function () {
//            roomController.resetForm();
//            $('#blockList').attr('hidden', 'hidden');
//            $('#blockCreate').removeAttr('hidden')
//            $('#roomHeader').html("Thêm mới phòng");
//            $('#btnSave').html("Thêm mới");
//            $('#modalRoom').modal('show');
//        });

//        $('.btn-edit').off('click').on('click', function () {

//            $('#btnSave').html("Chỉnh sửa");
//            $('#blockList').attr('hidden','hidden');
//            $('#blockCreate').removeAttr('hidden');
//            $('#roomHeader').html("Chỉnh sửa thông tin phòng");
//            var id = $(this).data('id');
//            $('#modalRoom').modal('show');
//            roomController.resetForm();
//            roomController.loadDetail(id);
//        });
//        $('.btn-delete').off('click').on('click', function () {
//            var id = $(this).data('id');
//            bootbox.confirm("Bạn có chắc chắn muốn xóa danh mục này không?", function (result) {
//                if (result) {
//                    roomController.delete(id);
//                };

//            });
//        });
//        $('#btn-Deletemulti').off('click').on('click', function () {
//            bootbox.confirm("Bạn có chắc muốn xóa các bản ghi được chọn không?", function (result) {
//                if (result)
//                    roomController.deleteMul();
//            });

//        });
//        $('#txtSearch').change(function () {
//            roomController.loadData(true);
//        });

//        $('#btn-refresh').off('click').on('click', function () {
//            $('#txtSearch').val('');
//            roomController.loadData(true);
//        });

//        $('#selectAll').change(function () {
//            $('.selectedItem').prop('checked', $(this).prop('checked'));
//        });
//        $('.selectedItem').on('click', function () {
//            $(this).attr('checked', this.checked ? '' : 'checked')
//        });

//        $('.selectedItem').on('change', function () {
//            var selectedItem = $('.selectedItem').attr('checked').length;
//            if (selectedItem > 1) {
//                $('#btn-Deletemulti').removeAttr('disabled');
//            } else {
//                $('#btn-Deletemulti').add('disabled');
//            };
//        });

//        $('#btnShowChart').click(function () {
//            var ctx = document.getElementById('myChart').getContext('2d');
//            $.ajax({
//                url: '/Room/GetChart',
//                type: 'get',
//                dataType: 'json',
//                success: function (res) {
//                    var roomStatus = res.roomStatus;
//                    var repartition = res.repartition;
//                    var chart = new Chart(ctx, {
//                        // The type of chart we want to create
//                        type: 'pie',

//                        // The data for our dataset
//                        data: {
//                            labels: ["Đã thuê","Còn trống"],
//                            datasets: [{
//                                label: "Thống kê phòng",
//                                backgroundColor: ["rgb(233, 30, 99)",
//                                "rgb(255, 193, 7)"],
//                                borderColor: 'rgb(255, 99, 132)',
//                                data: repartition,
//                            }]
//                        },

//                        // Configuration options go here
//                        options: {
//                            maintainAspecRatio: false,
//                            scales: {
//                                yAxes: [{
//                                    ticks: {
//                                        beginAtZero: true
//                                    }
//                                }]
//                            }

//                        }
//                    });
//                }
//            });

//        });

//        $("#btnExportExcel").click(function (e) {
//            e.preventDefault();
//            $.ajax({
//                url: '/Room/ExportExcel',
//                type: 'post',
//                dataType: 'json',
//                response: function (res) {
//                    if (res.status === true) {
//                        toastr.success("Chúc mừng bạn đã xuất thành công!:)");
//                    } else {
//                        toastr.error("Chúc mừng bạn đã xuất không thành công!:)");
//                    }
//                }
//            })
//        });
//        $('#printTable').click(function () {
//            var print = document.getElementById('tbData');
//            var wme = window.open("", "", "width:auto", "height:auto");
//            wme.document.write(print.outerHTML);
//            wme.document.close();
//            wme.focus();
//            wme.print();
//            wme.close();
//        });
//        $('.btn-ViewDetail').click(function () {
//            var id = $(this).data('id');
//            $.ajax({
//                url: '/Room/GetDetail',
//                data: {
//                    id: id
//                },
//                type: 'GET',
//                dataType: 'json',
//                success: function (res) {
//                    if (res.status === true) {
//                        var item = res.data;
//                        $('#txt_RoomName').html("Tên phòng: " + item.RoomName);
//                        $('#txt_CTD').html("Mã công tơ điện: " + item.MaSoCongToDien);
//                        $('#txt_CTN').html("Mã công tơ nước: " + item.MaSoCongToNuoc);

//                        $('#txt_Description').html("Miêu tả: " + item.Description);
//                     }
//                    else {
//                        toastr.error(res.message);
//                        roomController.loadData(true);
//                    }
//                    $('#viewRoom').modal('show');
//                }

//            });
//        });
//        $("#fileButton").click(function () {
//            var files = $("#fileInput").get(0).files;
//            var fileData = new FormData();

//            for (var i = 0; i < files.length; i++) {
//                fileData.append("fileInput", files[i]);
//            }

//            $.ajax({
//                type: "POST",
//                url: "/Room/UploadFiles",
//                dataType: "json",
//                contentType: false, // Not to set any content header
//                processData: false, // Not to process data
//                data: fileData,
//                success: function (result, status, xhr) {
//                    alert(result);
//                },
//                error: function (xhr, status, error) {
//                    alert(status);
//                }
//            });
//        });

//    },
//    delete: function (id) {
//        $.ajax({
//            url: '/Room/Delete',
//            data: { id: id },
//            type: 'post',
//            dataType: 'json',
//            success: function (res) {
//                toastr.success(res.message);
//                roomController.loadData(true);
//            }
//        });
//    },
//    deleteMul: function () {
//        var listSelected = [];

//        $("td input:checked").each(function () {
//            listSelected.push($(this).data('id'));

//        });
//        if (listSelected.length == 0) {
//            toastr.warning("Không có phần tử nào được chọn!");
//        } else {
//            $.ajax({
//                url: '/Room/DeleteMul',
//                data: {
//                    ids: listSelected
//                },
//                type: 'post',
//                dataType: 'json',
//                success: function (response) {
//                    toastr.success(response.message);
//                    roomController.loadData(true);
//                }
//            });
//        }
//    },
//    loadCTN: function () {
//        var listOption = $('#txtCongToNuoc');
//        $.ajax({
//            url: '/CongToNuoc/loadCTN',
//            type: 'get',
//            dataType: 'json',
//            success: function (response) {
//                if (response.status) {
//                    var data = response.data;
//                    $(data).each(function (i, item) {
//                        listOption.append($('<option/>', { value: item.ID, text: item.MaSoCongTo }));
//                    });
//                }
//            }
//        });
//    }, loadCTD: function () {
//        var listOption = $('#txtCongToDien');
//        $.ajax({
//            url: '/CongToDien/loadCTD',
//            type: 'get',
//            dataType: 'json',
//            success: function (response) {
//                if (response.status) {
//                    var data = response.data;
//                    $(data).each(function (i, item) {
//                        listOption.append($('<option/>', { value: item.ID, text: item.MaSoCongTo}));
//                    });
//                }
//            }
//        });
//    },
//    LoadRoomNameList: function () {
//        var listOption = $('#txtListRoomName');
//        $.ajax({
//            url: '/Room/LoadRoomList',
//            type: 'get',
//            dataType: 'json',
//            success: function (response) {
//                if (response.status) {
//                    var data = response.data;
//                    $(data).each(function (i, item) {
//                        listOption.append($('<option/>', { value: item.RoomName, text: item.RoomName }));
//                    });
//                }
//            }
//        });
//    },
//    // cần sửa
//    loadStudentList: function (option) {
//        var list = $('#listStudent');
//        $.ajax({
//            url: '/Students/LoadStudentList',
//            data: {
//                typeRoom: option
//            },
//            type: 'get',
//            dataType: 'json',
//            success: function (response) {
//                if (response.status) {
//                    $('#listStudent').select2().val(null).trigger('change');
//                    var data = response.data;
//                    $(data).each(function (i, item) {
//                        var gender = "";
//                        if (item.Gender == 1) {
//                            gender = " (Nam)";
//                            list.append($('<option/>', { value: item.ID, text: item.Name + gender }));
//                        } else if (item.Gender == 0) {
//                            gender = " (Nữ)";
//                            list.append($('<option/>', { value: item.ID, text: item.Name + gender }));
//                        }

//                    });
//                    $('#listStudent').select2();
//                }
//            }
//        });

//    },
//    resetForm: function () {
//        $('.validate').val('');
//        $('#txtId').val('');
//        $('#txtRoomCode').val('');
//        $('#txtRoomName').val('');
//        $('#txtDescription').val('');
//        $('#txtStatus').val('');
//    },
//    checkExist: function (Name) {
//        var result = false;
//        $.ajax({
//            url: '/Room/CheckExist',
//            data: {
//                name: Name
//            },
//            type: 'get',
//            dataType: 'json',
//            success: function (response) {
//                if (response.result === true) {
//                    roomController.Post();
//                } else {
//                    $('.validate').html('Mã phòng ' + Name + ' đã tồn tại!');
//                }
//            }
//        });
//    },
//    loadDetail: function (id) {
//        $.ajax({
//            url: '/Room/GetDetail',
//            data: {
//                id: id
//            },
//            type: 'GET',
//            dataType: 'json',
//            success: function (res) {
//                if (res.status === true) {
//                    var item = res.data;
//                    $('#txtId').val(item.ID);
//                    $('#txtRoomCode').val(item.RoomCode);
//                    $('#txtRoomName').val(item.RoomName);
//                    editor.setData(item.Description);
//                    $('#txtStatus').prop('checked',item.Status);
//                }
//                else {
//                    toastr.error(res.message);
//                    roomController.loadData(true);
//                }
//            }

//        });
//    },
//    Post: function () {
//        var Code= $('#txtRoomCode').val();
//        var Name= $('#txtRoomName').val();
//        var Description =editor.getData();
//        var MaSoCongToDien = $('#txtCongToDien').val();
//        var MaSoCongToNuoc = $('#txtCongToNuoc').val();
//        var Status= $('#txtStatus').prop('checked');
//        var e = {
//            RoomCode:Code,
//            RoomName: Name,
//            Description: Description,
//            MaSoCongToDien: MaSoCongToDien,
//            MaSoCongToNuoc: MaSoCongToNuoc,
//            Status: Status
//           };
//        $.ajax({
//            url: '/Room/Post',
//            data: {
//                room: JSON.stringify(e)
//            },
//            type: 'post',
//            dataType: 'json',
//            success: function (response) {
//                if (response.status) {
//                    $('#modalRoom').modal('hide');
//                    $('#blockList').removeAttr('hidden');
//                    $('#blockCreate').attr('hidden','hidden');
//                    toastr.success(response.message);
//                    roomController.loadData(true);
//                } else {
//                    $('#modalRoom').modal('hide');
//                    toastr.error(response.message);
//                }
//            }
//        });
//    },
//    Put: function () {

//        var id = $("#txtId").val();
//        var Code = $('#txtRoomCode').val();
//        var Name = $('#txtRoomName').val();
//        var Description =editor.getData();
//        var MaSoCongToDien = $('#txtCongToDien').val();
//        var MaSoCongToNuoc = $('#txtCongToNuoc').val();
//        var Status = $('#txtStatus').prop('checked');
//        var e = {
//            ID:id,
//            RoomCode: Code,
//            RoomName: Name,
//            Description: Description,
//            MaSoCongToDien: MaSoCongToDien,
//            MaSoCongToNuoc: MaSoCongToNuoc,
//            Status: Status
//        };
//        $.ajax({
//            url: '/Room/Put',
//            data: {
//                room: JSON.stringify(e)
//            },
//            type: 'post',
//            dataType: 'json',
//            success: function (response) {
//                if (response.status) {
//                    $('#blockList').removeAttr('hidden');
//                    $('#blockCreate').attr('hidden','hidden');
//                    toastr.success(response.message);
//                    roomController.loadData(true);
//                } else {
//                    toastr.error(response.message);
//                }
//            }
//        });
//    },
//    loadDsPhong: function () {
//        $.ajax({
//            url: "/Room/LoadRoomList",
//            type: "GET",
//            dataType: "json",
//            success: function (response) {
//                if (response.status === true) {
//                    // Xóa nội dung hiện tại của tbody
//                    $("#tbEmptyRoomData").empty();
//                   // print(response.data);
//                    // Lặp qua danh sách phòng và thêm dữ liệu vào tbody

//                    var template = $("#emtyroom-template").html();
//                    var html = '';
//                    $.each(response.data, function (i, item) {
//                        html += Mustache.render(template, {
//                            ID: item.ID,
//                            RoomName: item.RoomName,
//                            MaLoaiPhong: item.MaLoaiPhong,
//                            Status: item.Status == true ? "Còn phòng" : "Hết phòng",
//                        });
//                    });
//                    //var rendered = Mustache.render(template, { data: response.data });
//                    $("#tbEmptyRoomData").append(html);
//                } else {
//                    console.log("Lỗi: Không thể tải danh sách phòng");
//                }
//            },
//            error: function (xhr, status, error) {
//                console.log("Lỗi: " + error);
//            }
//        });
//    },
//    loadData: function (changePageSize) {
//        var search = $('#txtSearch').val();
//        $.ajax({
//            url: '/Room/GetAll',
//            type: 'GET',
//            data: {
//                searchstr: search,
//                page: config.pageIndex,
//                pageSize: config.pageSize
//            },
//            dataType: 'json',
//            success: function (response) {
//                if (response.status) {
//                    var data = response.data;
//                    var html = '';
//                    var template = $('#data-template').html();
//                    $.each(data, function (i, item) {
//                        html += Mustache.render(template, {
//                            ID: item.ID,
//                            RoomCode: item.RoomCode,
//                            RoomName: item.RoomName,
//                            Status: (item.Status== 1) ? "Được thuê" : "Còn phòng",
//                            Description: item.Description
//                        });
//                    });
//                    $('#tbData').html(html);
//                    var totalPage = Math.ceil(response.total / config.pageSize);
//                    roomController.paging(response.total, function () {

//                        roomController.loadData();
//                        $('#currentpage').html(config.pageIndex);
//                        $('#totalpage').html(totalPage);
//                    }, changePageSize);
//                    roomController.registerEvent();
//                }
//            }
//        });
//    },
//    paging: function (totalRow, callback, changePageSize) {
//        var totalPage = Math.ceil(totalRow / config.pageSize);
//        if ($('#pagination a').length === 0 || changePageSize === true) {
//            $('#pagination').empty();
//            $('#pagination').removeData("twbs-pagination");
//            $('#pagination').unbind("page");
//        }
//        $('#pagination').twbsPagination({
//            totalPages: totalPage,
//            first: 'Đầu',
//            prev: 'Trước',
//            next: 'Tiếp ',
//            last: 'Cuối',
//            visiblePages: 10,
//            onPageClick: function (event, page) {
//                config.pageIndex = page;
//                setTimeout(callback, 200)
//            }
//        })
//    }
//}
//roomController.init();
var config = {
    pageSize: 20,
    pageIndex: 1
}
var roomController = {
    init: function () {
        roomController.loadCTD();
        roomController.loadCTN();
        roomController.loadAllCTD();
        roomController.loadAllCTN();
        roomController.loadRoomList();
        roomController.loadStudentList();
        roomController.loadTypeRoom();
        roomController.loadData();
        roomController.loadEmtyRoomData();
        roomController.showChart();
        roomController.registerEvent();
    },
    registerEvent: function () {

        $('#frmSaveData').validate({
            rules: {
                roomCode: "required",
                RoomName: "required",
                MaCTD: "required",
                MaCTN: "required"
            },
            messages: {
                roomCode: "Yêu cầu nhập mã phòng",
                RoomName: "Yêu cầu nhập tên phòng",
                MaCTD: "Yêu cầu nhập mã công tơ điện",
                MaCTN: "Yêu cầu nhập mã công tơ nước"
            }
        });
        $('#frmEditData').validate({
            rules: {
                EditRoomCode: "required",
                EditRoomName: "required",
                EditMaCTD: "required",
                EditMaCTN: "required"
            },
            messages: {
                EditRoomCode: "Yêu cầu nhập mã phòng",
                EditRoomName: "Yêu cầu nhập tên phòng",
                EditMaCTD: "Yêu cầu nhập mã công tơ điện",
                EditMaCTN: "Yêu cầu nhập mã công tơ nước"
            }
        });
        $('#SaveEdit').off('click').on('click', function () {
            var id = $('#EditId').val();
            if ($('#frmEditData').valid()) {
                if (id !== '') {
                    roomController.Put();
                }
            }
        });
        $('#btnSave').off('click').on('click', function () {
            var Name = $('#txtRoomCode').val();
            var id = $('#txtId').val();
            if ($('#frmSaveData').valid()) {
                if (id !== '') {
                    roomController.Put();
                } else {
                    roomController.checkExist(Name);
                }
            }
        });
        $('.btn-Save').on('click', function () {
            var listStudent = $('#listStudent').val();
            var roomID = $('#txtListRoomName').val();
            $.ajax({
                url: '/Room/AddStudentToRoom',
                data: {
                    roomID: roomID,
                    listStudent: listStudent
                },
                type: 'Post',
                dataType: 'json',
                success: function (res) {
                    if (res.status) {
                        toastr.success('Thành công');
                        location.reload();
                    } else
                        toastr.error('Thất bại! hãy thử lại');
                }
            })
        });
        $('.btn-LoadDetails').off('click').on('click', function () {
            var id = $('#SelectRoom').val();
            roomController.loadDetail(id);
        });
        $('.btn-delete').off('click').on('click', function () {
            var id = $(this).data('id');
            bootbox.confirm("Bạn có chắc chắn muốn xóa danh mục này không?", function (result) {
                if (result) {
                    roomController.delete(id);
                };

            });
        });
        $('#btn-Deletemulti').off('click').on('click', function () {
            bootbox.confirm("Bạn có chắc muốn xóa các bản ghi được chọn không?", function (result) {
                if (result)
                    roomController.deleteMul();
            });

        });
        $('#txtSearch').change(function () {
            roomController.loadData(true);
        });
        $('#txtEmptyRoomSearch').change(function () {
            roomController.loadEmtyRoomData();
        });

        $('.btn-refresh').off('click').on('click', function () {
            $('#txtSearch').val('');
            $('#txtEmptyRoomSearch').val('');
            roomController.loadData(true);
        });

        $('#selectAll').change(function () {
            $('.selectedItem').prop('checked', $(this).prop('checked'));
            $('#btn-Deletemulti').removeAttr('disabled');
        });
        $('.selectedItem').on('click', function () {
            $(this).attr('checked', this.checked ? '' : 'checked')
        });

        $("#btnExportExcel").click(function (e) {
            e.preventDefault();
            $.ajax({
                url: '/Room/ExportExcel',
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
        $('.btn-ViewDetail').click(function () {
            var id = $(this).data('id');
            $.ajax({
                url: '/Room/GetDetail',
                data: {
                    id: id
                },
                type: 'GET',
                dataType: 'json',
                success: function (res) {
                    if (res.status === true) {
                        var item = res.data;
                        $('#txt_RoomName').html("Tên phòng: " + item.RoomName);
                        $('#txt_CTD').html("Mã công tơ điện: " + item.MaSoCongToDien);
                        $('#txt_CTN').html("Mã công tơ nước: " + item.MaSoCongToNuoc);

                        $('#txt_Description').html("Miêu tả: " + item.Description);
                    }
                    else {
                        toastr.error(res.message);
                        roomController.loadData(true);
                    }
                    $('#viewRoom').modal('show');
                }

            });
        });
        $("#fileButton").click(function () {
            var files = $("#fileInput").get(0).files;
            var fileData = new FormData();

            for (var i = 0; i < files.length; i++) {
                fileData.append("fileInput", files[i]);
            }

            $.ajax({
                type: "POST",
                url: "/Room/UploadFiles",
                dataType: "json",
                contentType: false, // Not to set any content header
                processData: false, // Not to process data
                data: fileData,
                success: function (result, status, xhr) {
                    alert(result);
                },
                error: function (xhr, status, error) {
                    alert(status);
                }
            });
        });
        $(".addToRoom").click(function () {
            var files = $("#fileInput").get(0).files;
            var fileData = new FormData();

            for (var i = 0; i < files.length; i++) {
                fileData.append("fileInput", files[i]);
            }

            $.ajax({
                type: "POST",
                url: "/Room/UploadFiles",
                dataType: "json",
                contentType: false, // Not to set any content header
                processData: false, // Not to process data
                data: fileData,
                success: function (result, status, xhr) {
                    alert(result);
                },
                error: function (xhr, status, error) {
                    alert(status);
                }
            });
        });
        $('.btn-ListStudent').click(function () {
            var id = $(this).data('id');
            $('#loadList li').remove();
            $.ajax({
                url: '/Room/GetDetail',
                data: {
                    id: id
                },
                type: 'GET',
                dataType: 'json',
                success: function (res) {
                    if (res.status === true) {
                        var data = res.data;
                        $.each(data, function (i, item) {
                            $('#loadList').append($('<li>', { text: item.Name }))
                        })

                    }
                    else {
                        toastr.error(res.message);
                        studentController.loadData(true);
                    }
                    $('#viewListStudent').modal('show');
                }

            });
        });
    },

    delete: function (id) {
        $.ajax({
            url: '/Room/Delete',
            data: { id: id },
            type: 'post',
            dataType: 'json',
            success: function (res) {
                toastr.success(res.message);
                roomController.loadData(true);
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
                url: '/Room/DeleteMul',
                data: {
                    ids: listSelected
                },
                type: 'post',
                dataType: 'json',
                success: function (response) {
                    toastr.success(response.message);
                    roomController.loadData(true);
                }
            });
        }
    },
    loadCTN: function () {
        var listOption = $('#txtCongToNuoc');

        $.ajax({
            url: '/CongToNuoc/loadCTN',
            type: 'get',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    $(data).each(function (i, item) {
                        listOption.append($('<option/>', { value: item.ID, text: item.MaSoCongTo }));
                    });
                    $('#txtCongToNuoc').select2();

                }
            }
        });
    },
    showChart: function () {
        var ctx = document.getElementById('myChart').getContext('2d');
        $.ajax({
            url: '/Room/GetChart',
            type: 'get',
            dataType: 'json',
            success: function (res) {
                var roomStatus = res.roomStatus;
                var lbss = "Sẵn sàng";
                var lbkss = "Không sẵn sàng";


                var repartition = res.repartition;
                var chart = new Chart(ctx, {
                    // The type of chart we want to create
                    type: 'pie',

                    // The data for our dataset
                    data: {
                        labels: [lbss, lbkss],
                        datasets: [{
                            label: "Thống kê phòng",
                            backgroundColor: ["rgb(233, 30, 99)",
                                "rgb(255, 193, 7)"],
                            borderColor: 'rgb(255, 99, 132)',
                            data: repartition,
                        }]
                    },

                    // Configuration options go here
                    options: {
                        maintainAspecRatio: false,
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }

                    }
                });
            }
        });

    },
    loadTypeRoom: function () {
        var listOption = $('#txtTypeRoom');
        var listOption1 = $('#EditMaLoaiPhong');
        $.ajax({
            url: '/TypeRoom/GetAll',
            type: 'get',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    $(data).each(function (i, item) {
                        listOption.append($('<option/>', { value: item.MaLoaiPhong, text: item.TenLoaiPhong }));
                        listOption1.append($('<option/>', { value: item.MaLoaiPhong, text: item.TenLoaiPhong }));
                    });
                    $('#txtTypeRoom').select2();
                    $('#EditMaLoaiPhong').select2();
                }
            }
        });
    },
    loadCTD: function () {
        var listOption = $('#txtCongToDien');
        var listOption1 = $('#EditCongToDien');
        $.ajax({
            url: '/CongToDien/loadCTD',
            type: 'get',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    $(data).each(function (i, item) {
                        listOption.append($('<option/>', { value: item.ID, text: item.MaSoCongTo }));
                        listOption1.append($('<option/>', { value: item.ID, text: item.MaSoCongTo }));
                    });
                    $('#txtCongToDien').select2();
                    $('#EditCongToDien').select2();
                }
            }
        });
    },
    loadAllCTN: function () {
        var listOption = $('#EditCongToNuoc');
        $.ajax({
            url: '/CongToNuoc/loadAll',
            type: 'get',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    $(data).each(function (i, item) {
                        listOption.append($('<option/>', { value: item.ID, text: item.MaSoCongTo }));
                    });
                    $('#EditCongToNuoc').select2();
                }
            }
        });
    },
    loadAllCTD: function () {
        var listOption = $('#EditCongToDien');
        $.ajax({
            url: '/CongToDien/loadAll',
            type: 'get',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    $(data).each(function (i, item) {
                        listOption.append($('<option/>', { value: item.ID, text: item.MaSoCongTo }));
                    });
                    $('#EditCongToDien').select2();
                }
            }
        });
    },
    loadRoomList: function () {
        var listOption = $('#txtListRoomName');
        var listOption1 = $('#SelectRoom');
        $.ajax({
            url: '/Room/loadRoomList',
            type: 'get',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    $(data).each(function (i, item) {
                        listOption.append($('<option/>', { value: item.ID, text: item.RoomName + " - Phòng " + item.TenLoaiPhong }));
                        listOption1.append($('<option/>', { value: item.ID, text: item.RoomName + " - Phòng " + item.TenLoaiPhong }));
                    });
                    $('#txtListRoomName').select2();
                    $('#SelectRoom').select2();
                }
            }
        });
    },
    loadStudentList: function (option) {

        var list = $('#listStudent');
        $.ajax({
            url: '/Students/LoadStudentList',
            data: {
                typeRoom: option
            },
            type: 'get',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#listStudent').select2().val(null).trigger('change');
                    var data = response.data;
                    $(data).each(function (i, item) {
                        var gender = "";
                        if (item.Gender === 1) {
                            gender = "(Nam)";
                            list.append($('<option/>', { value: item.ID, text: item.Name + gender }));
                        } else if (item.Gender === 0) {
                            gender = "(Nữ)";
                            list.append($('<option/>', { value: item.ID, text: item.Name + gender }));
                        }

                    });
                    $('#listStudent').select2();
                }
            }
        });

    },
    resetForm: function () {
        $('.validate').val('');
        $('#txtId').val('');
        $('#txtRoomCode').val('');
        $('#txtRoomName').val('');
        $('#txtDescription').val('');
        $('#txtStatus').val('');
    },
    checkExist: function (Name) {
        var result = false;
        $.ajax({
            url: '/Room/CheckExist',
            data: {
                name: Name
            },
            type: 'get',
            dataType: 'json',
            success: function (response) {
                if (response.result === true) {
                    roomController.Post();
                } else {
                    $('.validate').html('Mã phòng ' + Name + ' đã tồn tại!');
                }
            }
        });
    },
    loadDetail: function (id) {
        $.ajax({
            url: '/Room/GetDetail',
            data: {
                id: id
            },
            type: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.status === true) {
                    var item = res.data;
                    $('#EditId').val(item.ID);
                    $('#EditRoomCode').val(item.RoomCode);
                    $('#EditRoomName').val(item.RoomName);
                    $('#EditCongToNuoc').val(item.RoomName);
                    tinymce.get("EditContent").setContent(item.Description);
                    $('#EditStatus').prop('checked', item.Status);
                }
                else {
                    toastr.error(res.message);
                    roomController.loadData(true);
                }
            }

        });
    },
    Post: function () {
        var Code = $('#txtRoomCode').val();
        var Name = $('#txtRoomName').val();
        var Description = tinymce.get('txtContent').getContent();
        var MaLoaiPhong = $('#txtTypeRoom').val();
        var SoSv = $('#txtSoSv').val();
        var GiaPhong = $('#txtGiaPhong').val();
        var MaSoCongToDien = $('#txtCongToDien').val();
        var MaSoCongToNuoc = $('#txtCongToNuoc').val();
        var Status = $('#txtStatus').prop('checked');
        var e = {
            RoomCode: Code,
            RoomName: Name,
            Description: Description,
            SoSV: SoSv,
            GiaPhong: GiaPhong,
            TypeRoomID: MaLoaiPhong,
            MaSoCongToDien: MaSoCongToDien,
            MaSoCongToNuoc: MaSoCongToNuoc,
            Status: Status
        };
        $.ajax({
            url: '/Room/Post',
            data: {
                room: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    toastr.success(response.message);
                    location.reload();
                } else {
                    toastr.error(response.message);
                }
            }
        });
    },
    Put: function () {

        var id = $("#EditId").val();
        var Code = $('#EditRoomCode').val();
        var Name = $('#EditRoomName').val();
        var Description = tinymce.get('EditContent').getContent();
        var MaLoaiPhong = $('#EditMaLoaiPhong').val();
        var MaSoCongToDien = $('#EditCongToDien').val();
        var MaSoCongToNuoc = $('#EditCongToNuoc').val();
        var Status = $('#EditStatus').prop('checked');
        var e = {
            ID: id,
            RoomCode: Code,
            RoomName: Name,
            Description: Description,
            TypeRoomID: MaLoaiPhong,
            MaSoCongToDien: MaSoCongToDien,
            MaSoCongToNuoc: MaSoCongToNuoc,
            Status: Status
        };
        $.ajax({
            url: '/Room/Put',
            data: {
                room: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    toastr.success(response.message);
                    location.reload();
                } else {
                    toastr.error(response.message);
                }
            }
        });
    },
    loadData: function (changePageSize) {
        var search = $('#txtSearch').val();
        $.ajax({
            url: '/Room/GetAll',
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
                    var studentCount = response.studentCount;
                    var tagRoomID = response.tagRoomID;
                    var html = '';
                    var template = $('#data-template').html();
                    $.each(data, function (i, item) {
                        html += Mustache.render(template, {
                            ID: item.ID,
                            RoomCode: item.RoomCode,
                            RoomName: item.RoomName,
                            Status: "Có " + "<span class='col-pink'>" + item.CountStudent + "</span>" + " sv",
                            Description: item.Description
                        });
                    });
                    $('#tbData').html(html);

                    var totalPage = Math.ceil(response.total / config.pageSize);
                    roomController.paging(response.total, function () {

                        roomController.loadData();
                        $('#currentpage').html(config.pageIndex);
                        $('#totalpage').html(totalPage);
                    }, changePageSize);
                    roomController.registerEvent();
                }
            }
        });
    },
    loadEmtyRoomData: function () {
        var search = $('#txtEmptyRoomSearch').val();
        $.ajax({
            url: '/Room/GetEmtyRoom',
            type: 'GET',
            data: {
                searchstr: search
            },
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;   
                    var studentCount = response.studentCount;
                    var tagRoomID = response.tagRoomID;
                    var html = '';
                    var template = $('#emtyroom-template').html();
                    $.each(data, function (i, item) {
                        html += Mustache.render(template, {
                            ID: item.ID,
                            RoomCode: item.roomCode,
                            RoomName: item.RoomName,
                            Status: item.Status === true ? "Sẵn sàng" : "Không sẵn sàng"
                        });
                    });
                    $('#tbEmptyRoomData').html(html);
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
                setTimeout(callback, 200);
            }
        });
    }
}
roomController.init();