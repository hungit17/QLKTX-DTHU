var config = {
    pageSize: 20,
    pageIndex: 1
}
var postsController = {
    init: function () {
        postsController.loadData();
        postsController.LoadPosts();
        postsController.registerEvent();
    },
    registerEvent: function () {

        $('#frmSaveData').validate({
            rules: {
                Name: "required",
                Avatar: "required",
                Content: "required"

            },
            messages: {
                Name: "Tên là bắt buộc",
                Avatar: "Yêu cầu phải có hình đại diện",
                Content: "Yêu cầu phải nội dung bài viết"

            }
        });

        $('#frmEditData').validate({
            rules: {
                EditName: "required",
                EditAvatar: "required",
                EditContent: "required"

            },
            messages: {
                EditName: "Tên là bắt buộc",
                EditAvatar: "Yêu cầu phải có hình đại diện",
                EditContent: "Yêu cầu phải nội dung bài viết"

            }
        });

        $('#btnSave').off('click').on('click', function () {
            var Name = $('#txtName').val();
            var id = $('#txtId').val();
            if ($('#frmSaveData').valid()) {
                if (id !== '') {
                    postsController.Put();
                } else {
                    postsController.checkExist(Name);
                }
            }
        });
        $('#SaveEdit').off('click').on('click', function () {
            if ($('#frmEditData').valid()) {

                postsController.Put();

            }
        });

        $('.btn-delete').off('click').on('click', function () {
            var id = $(this).data('id');
            bootbox.confirm("Bạn có chắc chắn muốn xóa danh mục này không?", function (result) {
                if (result) {
                    postsController.delete(id);
                };

            });
        });
        $('#btn-Deletemulti').off('click').on('click', function () {
            bootbox.confirm("Bạn có chắc muốn xóa các bản ghi được chọn không?", function (result) {
                if (result)
                    postsController.deleteMul();
            });

        });
        $('#txtSearch').change(function () {
            postsController.loadData(true);
        });

        $('#btn-refresh').off('click').on('click', function () {
            $('#txtSearch').val('');
            postsController.loadData(true);
        });
        $('#loadData').off('click').on('click', function () {
            var postID = $('#txtPostName').val();
            postsController.loadDetail(postID);
        });
        $('#selectAll').change(function () {
            $('.selectedItem').prop('checked', $(this).prop('checked'));
            $('#btn-Deletemulti').removeAttr('disabled');
        });

        $('.selectedItem').on('click', function () {
            $(this).attr('checked', this.checked ? '' : 'checked');

        });
        $('.btn-active').on('click', function () {
            var target = $(this);
            var id = $(this).data('id');
            $.ajax({
                url: '/Posts/ChangeStatus',
                data: {
                    id: id
                },
                type: 'post',
                dataType: 'json',
                success: function (res) {
                    if (res.status) {
                        toastr.success(res.message);
                        target.removeClass('col-pink');
                        target.addClass('col-green');
                        toastr.remove();
                        toastr.success("Đã kích hoạt")
                        target.html("check");
                    }

                    else {
                        target.removeClass('col-green');
                        target.addClass('col-pink');
                        toastr.remove();
                        toastr.info("Đã hủy kích hoạt");
                        target.text("cancel");
                    }

                }
            });

        });

        $('.selectedItem').on('change', function () {
            var selectedItem = $('.selectedItem').attr('checked').length;
            if (selectedItem > 1) {
                $('#btn-Deletemulti').removeAttr('disabled');
            } else {
                $('#btn-Deletemulti').add('disabled');
            };
        });

        $('.btn-view').click(function () {
            var id = $(this).data('id');
            $.ajax({
                url: '/Posts/GetDetail',
                data: {
                    id: id
                },
                type: 'GET',
                dataType: 'json',
                success: function (res) {
                    if (res.status === true) {
                        var item = res.data;
                        $('#txt_Content').html("Nội dung bài viết" + item.Content);
                    }
                    else {
                        toastr.error(res.message);
                        postsController.loadData(true);
                    }
                    $('#viewPosts').modal('show');
                }

            });
        });
    },
    delete: function (id) {
        $.ajax({
            url: '/Posts/Delete',
            data: { id: id },
            type: 'post',
            dataType: 'json',
            success: function (res) {
                toastr.success(res.message);
                postsController.loadData(true);
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
                url: '/Posts/DeleteMul',
                data: {
                    ids: listSelected
                },
                type: 'post',
                dataType: 'json',
                success: function (response) {
                    toastr.success(response.message);
                    postsController.loadData(true);
                }
            });
        }
    },

    resetForm: function () {
        $('#txtId').val('');
        $('#txtName').val('');
        $('#txtContent').val('');
        $('#txtAvatar').val('');
        $('#txtStatus').prop('checked', true);
    },
    checkExist: function (Name) {
        var result = false;
        $.ajax({
            url: '/Posts/CheckExist',
            data: {
                name: Name
            },
            type: 'get',
            dataType: 'json',
            success: function (response) {
                if (response.result === true) {
                    postsController.Post();
                } else {
                    $('.validate').html('Tên ' + Name + ' đã tồn tại!');
                }
            }
        });
    },
    loadDetail: function (id) {
        $.ajax({
            url: '/Posts/GetDetail',
            data: {
                id: id
            },
            type: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.status === true) {
                    var item = res.data;
                    $('#EditId').val(item.ID);
                    $('#EditName').val(item.Name);
                    tinymce.get("EditContent").setContent(item.Content);
                    $('#EditAvatar').val(item.Avatar);
                    $('#EditImg').attr('src', item.Avatar);
                    $('#EditStatus').val(item.Status);

                }
                else {
                    toastr.error(res.message);
                    postsController.loadData(true);
                }
            }

        });
    },
    Post: function () {
        var Name = $('#txtName').val();
        var Content = tinymce.get('txtContent').getContent();
        var Avatar = $('#txtAvatar').val();
        var Status = $('#txtStatus').prop('checked');
        var e = {
            Name: Name,
            Content: Content,
            Avatar: Avatar,
            Status: Status
        };
        $.ajax({
            url: '/Posts/Post',
            data: {
                posts: JSON.stringify(e)
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
        var Name = $('#EditName').val();
        var Content = tinymce.get('EditContent').getContent();
        var Avatar = $('#EditAvatar').val();
        var Status = $('#EditStatus').prop('checked');

        var e = {
            ID: id,
            Name: Name,
            Content: Content,
            Avatar: Avatar,
            Status: Status
        };
        $.ajax({
            url: '/Posts/Put',
            data: {
                posts: JSON.stringify(e)
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
    LoadPosts: function () {
        var listOption = $('#txtPostName');
        $.ajax({
            url: '/Posts/LoadPosts',
            type: 'get',
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    $(data).each(function (i, item) {
                        listOption.append($('<option/>', { value: item.ID, text: item.Name }));
                    });
                }
            }
        });
    },
    loadData: function (changePageSize) {
        var search = $('#txtSearch').val();
        $.ajax({
            url: '/Posts/GetAll',
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
                            CreatedDate: sharedController.parseDate(item.CreatedDate),
                            Status: item.Status == true ? "<a data-id='" + item.ID + "' class='material-icons col-green btn-active'>check</a>" : "<a data-id='" + item.ID + "' class='material-icons col-pink btn-active' >cancel</a>"

                        });
                    });
                    $('#tbData').html(html);
                    var totalPage = Math.ceil(response.total / config.pageSize);
                    postsController.paging(response.total, function () {

                        postsController.loadData();
                        $('#currentpage').html(config.pageIndex);
                        $('#totalpage').html(totalPage);
                    }, changePageSize);
                    postsController.registerEvent();
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
postsController.init();