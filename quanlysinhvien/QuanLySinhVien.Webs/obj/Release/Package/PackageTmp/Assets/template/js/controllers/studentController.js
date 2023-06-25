var config = {
    pageSize: 20,
    pageIndex: 1
}
var studentController = {
    init: function () {
        studentController.loadData();
        studentController.loadClassList();
        studentController.registerEvent();
    },
    registerEvent: function () {

        $('#frmSaveData').validate({
            rules: {
                Name: "required",
                MyClass: "required",
                BirthDay: "required",
                Email: "required",
            },
            messages: {
                Name: "Tên là bắt buộc",
                MyClass: "Yêu cầu nhập tên lớp",
                BirthDay: "Yêu cầu nhập ngày sinh",
                Email: "Yêu cầu nhập email"
            }
        });

        $('#btnAddNew').off('click').on('click', function () {
            if ($('#frmSaveData').valid()) {
                studentController.Post();
            }
        });


        $('.btn-edit').off('click').on('click', function () {

            $('#modal-title').html("Chỉnh sửa nội dung");
            $('#btnSave').html("Chỉnh sửa");
            var id = $(this).data('id');
            $('#modalStudent').modal('show');
            studentController.resetForm();
            studentController.loadDetail(id);
        });
        $('.btn-delete').off('click').on('click', function () {
            var id = $(this).data('id');
            bootbox.confirm("Bạn có chắc chắn muốn xóa danh mục này không?", function (result) {
                if (result) {
                    studentController.delete(id);
                };

            });
        });
        $('#btn-Deletemulti').off('click').on('click', function () {
            bootbox.confirm("Bạn có chắc muốn xóa các bản ghi được chọn không?", function (result) {
                if (result)
                    studentController.deleteMul();
            });

        });
        $('#txtSearch').change(function () {
            studentController.loadData(true);
        });


        $('#btn-refresh').off('click').on('click', function () {
            $('#txtSearch').val('');
            studentController.loadData(true);
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
        $('#txtMyClassList').on('change', function () {
            var selectItem = $(this).val();
            $.ajax({
                url: '/Students/LoadDepartmentList',
                data: {
                    classID: selectItem
                },
                type: 'get',
                dataType: 'json',
                response: function (res) {
                    if (res.status === true) {
                        var data = res.data;
                        $(data).each(function (i, item) {
                            selectList.append($('<option/>', { value: item.ID, text: item.DepartmentName }));
                        });
                    }
                }
            })
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
                url: '/Students/ExportExcel',
                type: 'post',
                dataType: 'json',
                response: function (res) {
                    if (res.status === true) {
                        toastr.success("Chúc mừng bạn đã xuất thành công!:)");
                    } else {
                        toastr.error("Chúc mừng bạn đã xuất không thành công!:)");
                    }
                }
            });
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
                url: '/Students/GetDetail',
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
                        studentController.loadData(true);
                    }
                    $('#viewStudent').modal('show');
                }

            });
        });
    },


    loadClassList: function () {
        var selectList = $('#txtMyClassList');
        $.ajax({
            url: "/Students/LoadClassList",
            type: 'get',
            dataType: 'json',
            success: function (res) {
                if (res.status == true) {
                    var data = res.data;
                    $(data).each(function (i, item) {
                        selectList.append($('<option/>', { value: item.ID, text: item.ClassName }));
                    })
                }
            }
        })
    },
    delete: function (id) {
        $.ajax({
            url: '/Students/Delete',
            data: { id: id },
            type: 'post',
            dataType: 'json',
            success: function (res) {
                toastr.success(res.message);
                studentController.loadData(true);
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
                url: '/Students/DeleteMul',
                data: {
                    ids: listSelected
                },
                type: 'post',
                dataType: 'json',
                success: function (response) {
                    toastr.success(response.message);
                    slideController.loadData(true);
                }
            });
        }
    },
    resetForm: function () {
        $('#txtId').val('');
        $('#txtName').val('');
        $('#txtAvatar').val('');
        $('#txtImg').attr('src', '');
        $('#Nam').attr('');
        $('#Nu').attr('');
        $('#txtBirthDay').val('');
        $('#txtAddress').val('');
        $('#txtPhoneNumber').val('');
    },
    checkExist: function (Name) {
        var result = false;
        $.ajax({
            url: '/Students/CheckExist',
            data: {
                name: Name
            },
            type: 'get',
            dataType: 'json',
            success: function (response) {
                if (response.result === true) {
                    studentController.Post();
                } else {
                    $('.validate').html('Tên ' + Name + ' đã tồn tại!');
                }
            }
        });
    },
    loadDetail: function (id) {
        $.ajax({
            url: '/Students/GetDetail',
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
                    $('#txtAvatar').val(item.Avatar);
                    $('#txtAddress').val(item.Address);
                    item.Gender == 1 ? $('#Nam').attr('checked', 'checked') : $('#Nu').attr('checked', 'checked');
                    $('#txtPhoneNumber').val(item.PhoneNumber);
                    $('#txtBirthDay').val(sharedController.standartDate(item.BirthDay));
                    $('#txtImg').attr('src', item.Avatar);
                    $('#txtMyClassList').attr('selected', item.DepartmentID);
                }
                else {
                    toastr.error(res.message);
                    studentController.loadData(true);
                }
            }

        });
    },
    Post: function () {
        var Name = $('#txtName').val();
        var Avatar = $('#txtAvatar').val();
        var BirthDay = $('#txtBirthDay').val();
        var Gender = $('input[name=Gender]:checked').val();
        var Address = $('#txtAddress').val();
        var PhoneNumber = $('#txtPhoneNumber').val();
        var Email = $('#txtEmail').val();
        var classID = $('#txtMyClassList').val();
        var e = {
            Name: Name,
            Avatar: Avatar,
            BirthDay: BirthDay,
            Gender: Gender,
            Address: Address,
            PhoneNumber: PhoneNumber,
            Email: Email,
            ClassID: classID
        };
        $.ajax({
            url: '/Students/Post',
            data: {
                student: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    location.reload();
                    toastr.success(response.message);
                } else {
                    toastr.error(response.message);
                }
            }
        });
    },
    Put: function () {

        var id = $("#txtId").val();
        var Name = $('#txtName').val();
        var Avatar = $('#txtAvatar').val();
        var BirthDay = $('#txtBirthDay').val();
        var Gender = $('input[name=Gender]:checked').val();
        var Address = $('#txtAddress').val();
        var PhoneNumber = $('#txtPhoneNumber').val();
        var classID = $('#txtMyClassList').val();
        var e = {
            ID: id,
            Name: Name,
            Avatar: Avatar,
            BirthDay: BirthDay,
            Gender: Gender,
            Address: Address,
            PhoneNumber: PhoneNumber,
            ClassID: classID
        };
        $.ajax({
            url: '/Students/Put',
            data: {
                student: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#modalStudent').modal('hide');
                    toastr.success(response.message);
                    studentController.loadData(true);
                } else {
                    $('#modalStudent').modal('hide');
                    toastr.error(response.message);
                }
            }
        });
    },
    loadData: function (changePageSize) {
        var search = $('#txtSearch').val();
        $.ajax({
            url: '/Students/GetAll',
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
                            Avatar: item.Avatar,
                            Gender: item.Gender == 1 ? "Nam" : "Nữ",
                            BirthDay: sharedController.parseDate(item.BirthDay),
                            Address: item.Address,
                            PhoneNumber: item.PhoneNumber,
                            ClassName: item.ClassName

                        });
                    });
                    $('#tbData').html(html);
                    var totalPage = Math.ceil(response.total / config.pageSize);
                    studentController.paging(response.total, function () {

                        studentController.loadData();
                        $('#currentpage').html(config.pageIndex);
                        $('#totalpage').html(totalPage);
                    }, changePageSize);
                    studentController.registerEvent();
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
studentController.init();