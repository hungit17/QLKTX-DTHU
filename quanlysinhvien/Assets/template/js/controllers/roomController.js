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
                if (id != '') {
                    roomController.Put();
                }
            }
        });
        $('#btnSave').off('click').on('click', function () {
            var Name = $('#txtRoomCode').val();
            var id = $('#txtId').val();
            if ($('#frmSaveData').valid()) {
                if (id != '') {
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

        $('.selectedItem').on('change', function () {
            var selectedItem = $('.selectedItem').attr('checked').length;
            if (selectedItem > 1) {
                $('#btn-Deletemulti').removeAttr('disabled');
            } else {
                $('#btn-Deletemulti').add('disabled');
            };
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
        if (listSelected.length == 0) {
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
                        listOption.append($('<option/>', { value: item.ID, text: item.MaSoCongTo}));
                        listOption1.append($('<option/>', { value: item.ID, text: item.MaSoCongTo}));
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
        var listOption= $('#EditCongToDien');
        $.ajax({
            url: '/CongToDien/loadAll',
            type: 'get',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    $(data).each(function (i, item) {
                        listOption.append($('<option/>', { value: item.ID, text: item.MaSoCongTo}));
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
                        listOption.append($('<option/>', { value: item.ID, text: item.RoomName }));
                        listOption1.append($('<option/>', { value: item.ID, text: item.RoomName }));
                    });
                }
            }
        });
    },
    loadStudentList: function () {
       
        var list = $('#listStudent');
        
        $.ajax({
            url: '/Students/LoadStudentList',
            type: 'get',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    $(data).each(function (i, item) {
                        list.append($('<option/>', { value: item.ID, text: item.Name }));
                    });
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
                    $('#EditStatus').prop('checked',item.Status);
                }
                else {
                    toastr.error(res.message);
                    roomController.loadData(true);
                }
            }

        });
    },
    Post: function () {
        var Code= $('#txtRoomCode').val();
        var Name= $('#txtRoomName').val();
        var Description = tinymce.get('txtContent').getContent();
        var MaSoCongToDien = $('#txtCongToDien').val();
        var MaSoCongToNuoc = $('#txtCongToNuoc').val();
        var Status= $('#txtStatus').prop('checked');
        var e = {
            RoomCode:Code,
            RoomName: Name,
            Description: Description,
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
                    $('#modalRoom').modal('hide');
                    $('#blockList').removeAttr('hidden');
                    $('#blockCreate').attr('hidden','hidden');
                    toastr.success(response.message);
                    location.reload();
                } else {
                    $('#modalRoom').modal('hide');
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
        var MaSoCongToDien = $('#EditCongToDien').val();
        var MaSoCongToNuoc = $('#EditCongToNuoc').val();
        var Status = $('#EditStatus').prop('checked');
        var e = {
            ID:id,
            RoomCode: Code,
            RoomName: Name,
            Description: Description,
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
                            Status: "Có " +"<span class='col-pink'>"+ item.CountStudent+"</span>"+" sv",
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
                            RoomCode: item.RoomCode,
                            RoomName: item.RoomName,
                            Status: item.Status==true?"Sẵn sàng":"Không sẵn sàng"
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
                setTimeout(callback, 200)
            }
        })
    }
}
roomController.init();