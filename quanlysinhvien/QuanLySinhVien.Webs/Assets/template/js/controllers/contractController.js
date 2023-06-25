var config = {
    pageSize: 20,
    pageIndex: 1
}
var contractController = {
    init: function () {
    
        contractController.loadData();
         contractController.loadClassList();
        contractController.loadDepartmentList();
        contractController.registerEvent();
    },
    registerEvent: function () {

       $('#frmSaveDataStudent').validate({
            rules: {
                Name: "required",
                BirthDay:"required",
                PhoneNumber: "required",
                EmailAddress:"required",
                MyClass:"required",
                Department:"required"

            },
            messages: {
                Name: "Tên là bắt buộc",
                BirthDay: "Ngày sinh là bắt buộc",
                MyClass: "Chọn một lớp",
                Department: "Vui lòng chọn khoa"

            }
        });

        $('#btnSaveContract').off('click').on('click', function () {
            var Name = $('#txt_Contract_Name').val();
            var id = $('#txt_Contract_Id').val();
            if ($('#frmSaveDataContract').valid()) {
                if (id !== '') {
                    contractController.Put();
                } else {
                    contractController.checkExist(Name);
                }
            }
        });
        $('#txt_Room_Code').validate({
            rules: {
                roomCode: "required",
                RoomName: "required"
            },
            messages: {
                roomCode: "Yêu cầu nhập mã phòng",
                RoomName: "Yêu cầu nhập tên phòng"

            }
        });
        $('#btnNext').off('click').on('click', function () {
            var Name = $('#txt_Name').val();
            if ($('#frmSaveDataStudent').valid()) {
                contractController.PostStudent();
            }
        });
        $('#btn-finish').off('click').on('click', function () {
            $.ajax({
                url: '/Contract/Finish',
                type: 'post',
                dataType: 'json',
                success: function (res) {
                    if (res.status) {
                        toastr.success("Cảm ơn bạn đã đăng ký hệ thống ký túc xá!\n Chúng tôi sẻ liên hệ với bạn sớm nhất có thể");
                    } else {
                        toastr.error("Có lỗi sảy ra! vui lòng thực hiện đầy đủ các yêu cầu");
                    }
                }
            })
        });
        $('#btnSaveRoom').off('click').on('click', function () {
            var Name = $('#txt_Room_Name').val();
            if ($('#frmSaveDataRoom').valid()) {
                contractController.PostRoom();
            }
        });  
        $('#btnAddNew').off('click').on('click', function () {
            contractController.resetForm();
            $('#modal-title').html("Tạo mới hợp đồng sinh viên");
            $('#btnSave').html("Thêm mới");
            $('#modalContract').modal('show');
        });

        $('.btn-edit').off('click').on('click', function () {

            $('#modal-title').html("Chỉnh sửa nội dung");
            $('#btnSave').html("Chỉnh sửa");
            var id = $(this).data('id');
            $('#modalContract').modal('show');
            contractController.resetForm();
            contractController.loadDetail(id);
        });
        $('.btn-delete').off('click').on('click', function () {
            var id = $(this).data('id');
            bootbox.confirm("Bạn có chắc chắn muốn xóa danh mục này không?", function (result) {
                if (result) {
                    contractController.delete(id);
                };

            });
        });
        $('#btn-Deletemulti').off('click').on('click', function () {
            bootbox.confirm("Bạn có chắc muốn xóa các bản ghi được chọn không?", function (result) {
                if (result)
                    contractController.deleteMul();
            });

        });
        $('#txtSearch').change(function () {
            contractController.loadData(true);
        });
        $('#txtSearch').on('mouseout', function () {
            $(this).val('');
        });

        $('#btn-refresh').off('click').on('click', function () {
            $('#txtSearch').val('');
            contractController.loadData(true);
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
                url: '/Contract/ExportExcel',
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

        // btn-Approved
        

        $(document).off("click", ".btn-Approved").on("click", ".btn-Approved", function () {
            var id = $(this).data("id");
            approveContract(id);
        });

        function approveContract(id) {
            $.ajax({
                url: '/Contract/ApprovedContract',
                type: 'POST',
                data: { id: id },
                dataType: 'json',
                success: function (res) {
                    if (res.status === true) {
                        toastr.options.backgroundColor = '#4CAF50'; 
                        toastr.success(res.message);
                        // Thực hiện các hành động khác khi phê duyệt thành công
                    } else {
                        toastr.error(res.message);
                        // Thực hiện các hành động khác khi phê duyệt không thành công
                    }
                },
                error: function (xhr, status, error) {
                    toastr.error("Đã xảy ra lỗi trong quá trình gửi yêu cầu.");
                }
            });
        }




           
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
                url: '/Contract/GetDetail',
                data: {
                    id: id
                },
                type: 'GET',
                dataType: 'json',
                success: function (res) {
                    if (res.status === true) {
                        var item = res.data;
                        $('#txt_Contract').html("Tên hợp đồng" + item.ContractName);
                        $('#txt_Name').html("Họ và tên sinh viên: "+item.Name);
                        $('#txt_CreatedDate').html("Ngày tạo hợp đồng:" + sharedController.standartDate(item.CreatedDate));
                        $('#txt_ExpireDate').html("Ngày hết hạn: " + sharedController.standartDate(item.ExpireDate));
                        $('#txt_Content').html("Nội dung: "+item.Content);

                    }
                    else {
                        toastr.error(res.message);
                        contractController.loadData(true);
                    }
                    $('#viewContract').modal('show');
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
                if (res.status === true) {
                    var data = res.data;
                    $(data).each(function (i, item) {
                        selectList.append($('<option/>', { value: item.ID, text: item.ClassName }));
                    })
                }
            }
        })
    },
    loadDepartmentList: function () {
        var selectList = $('#txtDepartmentList');
        $.ajax({
            url: '/Students/LoadDepartmentList',
            type: 'get',
            dataType: 'json',
            success: function (res) {
                if (res.status === true) {
                    var data = res.data;
                    $(data).each(function (i, item) {
                        selectList.append($('<option/>', { value: item.ID, text: item.DepartmentName }));
                    })
                }
            }
        })
    },
    delete: function (id) {
        $.ajax({
            url: '/Contract/Delete',
            data: { id: id },
            type: 'post',
            dataType: 'json',
            success: function (res) {
                toastr.success(res.message);
                contractController.loadData(true);
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
                url: '/Contract/DeleteMul',
                data: {
                    ids: listSelected
                },
                type: 'post',
                dataType: 'json',
                success: function (response) {
                    toastr.success(response.message);
                    contractController.loadData(true);
                }
            });
        }
    },

    resetForm: function () {
        $('#txtId').val('');
        $('#txtName').val('');
        $('#txtContractName').val('');
        $('#txtContent').val('');
        $('#txtCreatedDate').val('');
        $('#txtExpireDate').val('');
    },
    checkExist: function (Name) {
        var result = false;
        $.ajax({
            url: '/Contract/CheckExist',
            data: {
                name: Name
            },
            type: 'get',
            dataType: 'json',
            success: function (response) {
                if (response.result === true) {
                    contractController.Post();
                } else {
                    $('.validate').html('Tên ' + Name + ' đã tồn tại!');
                }
            }
        });
    },
    loadDetail: function (id) {
        $.ajax({
            url: '/Contract/GetDetail',
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
                    $('#txtContractName').val(item.ContractName);
                    $('#txtContent').val(item.Content);
                    $('#txtCreatedDate').val(sharedController.standartDate(item.CreatedDate));
                    $('#txtExpireDate').val(sharedController.standartDate(item.ExpireDate));
                }
                else {
                    toastr.error(res.message);
                    contractController.loadData(true);
                }
            }

        });
    },
    Post: function () {
     
        var ContractName = $('#txt_Contract_Name').val();
        var Content = $('#txt_Contract_Content').val();
        var CreatedDate = $('#txt_Contract_CreatedDate').val();
        var ExpireDate = $('#txt_Contract_ExpireDate').val();
        var e = {
            ContractName: ContractName,
            Content: Content,
            CreatedDate: CreatedDate,
            ExpireDate: ExpireDate
        };
        $.ajax({
            url: '/Contract/Post',
            data: {
                contract: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#modalContract').modal('hide');
                    $('#modalStudent').modal('show');
                } else {
                    $('#modalContract').modal('hide');
                    toastr.error(response.message);
                }
            }
        });
    },
    PostStudent: function () {
        var Name = $('#txt_Name').val();
        var Avatar = $('#txt_Avatar').val();
        var BirthDay = $('#txt_BirthDay').val();
        var Gender = $('input[name=Gender]:checked').val();
        var Address = $('#txt_Address').val();
        var PhoneNumber = $('#txt_PhoneNumber').val();
        var Email = $('#txt_Email').val();
        var classID = $('#txtMyClassList').val();
        var departmentID = $('#txtDepartmentList').val();
        var e = {
            Name: Name,
            Avatar: Avatar,
            BirthDay: BirthDay,
            Gender: Gender,
            Address: Address,
            PhoneNumber: PhoneNumber,
            Email: Email,
            ClassID: classID,
            DepartmentID: departmentID
        };
        $.ajax({
            url: '/Contract/PostStudent',
            data: {
                student: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#studentForm').fadeOut(2000);
                    $('#studentForm').attr('hidden', 'hidden');
                    $('#contractForm').removeAttr('hidden');
                    $('#contractForm').fadeIn(2000);

                    toastr.success("Hoàn thành bước 1!");
           
                } else {
                    $('#modalStudent').modal('hide');
                    toastr.error("Lỗi khi thêm sinh viên!");
                }
            }
        });
    },
    PostRoom: function () {
        var Code = $('#txt_Room_Code').val();
        var Name = $('#txt_Room_Name').val();
        var Description = $('#txt_Room_Description').val();
        var Status = $('#txt_Room_Status').prop('checked');
        var e = {
            RoomCode: Code,
            RoomName: Name,
            Description: Description,
            Status: Status
        };
        $.ajax({
            url: '/Contract/Finish',
            data: {
                room: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#modalRoom').modal('hide');
                    toastr.success(response.message);
                    roomController.loadData(true);
                } else {
                    $('#modalRoom').modal('hide');
                    toastr.error(response.message);
                }
            }
        });
    },
    Put: function () {
        var id = $("#txtId").val();
        var Name = $('#txtName').val();
        var ContractName = $('#txtContractName').val();
        var Content = $('#txtContent').val();
        var CreatedDate = $('#txtCreatedDate').val();
        var ExpireDate = $('#txtExpireDate').val();

        var e = {
            Name: Name,
            ContractName: ContractName,
            Content: Content,
            CreatedDate: CreatedDate,
            ExpireDate: ExpireDate
        };$.ajax({
            url: '/Contract/Put',
            data: {
                contract: JSON.stringify(e)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    $('#modalContract').modal('hide');
                    toastr.success(response.message);
                    contractController.loadData(true);
                } else {
                    $('#modalContract').modal('hide');
                    toastr.error(response.message);
                }
            }
        });
    },

    loadData: function (changePageSize) {
        var search = $('#txtSearch').val();
        $.ajax({
            url: '/Contract/GetAll',
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
                            Email: item.Email,
                            PhoneNumber: item.PhoneNumber,
                            Gender: item.Gender==true?"Nam":"Nữ",
                            CreatedDate: sharedController.parseDate(item.CreatedDate),
                            UrlContract: item.UrlContract,
                            Status: item.Status == true ? "Đã duyệt" : "Chưa duyệt",
                             colorRow:item.Status == true ? 'bg-green' : 'col-pink' 
                        });
                    });
                    $('#tbData').html(html);
                    var totalPage = Math.ceil(response.total / config.pageSize);
                    contractController.paging(response.total, function () {

                        contractController.loadData();
                        $('#currentpage').html(config.pageIndex);
                        $('#totalpage').html(totalPage);
                    }, changePageSize);
                    contractController.registerEvent();
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
contractController.init();