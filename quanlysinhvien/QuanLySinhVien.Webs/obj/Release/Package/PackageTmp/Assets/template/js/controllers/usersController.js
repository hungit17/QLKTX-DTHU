var config = {
    pageSize: 20,
    pageIndex: 1
}
var usersController = {
    init: function () {
        usersController.loadData();
        usersController.registerEvent();
    },
    registerEvent: function () {

        $('.btn-view').off('click').on('click', function () {

            $('#largeModalLabel').html("Xem các quyền hiện có");
            var id = $(this).data('id');
            usersController.loadRoleList(id);
            $('#userDetail').modal('show');
        });

        $('.btn-delete').off('click').on('click', function () {
            var id = $(this).data('id');
            bootbox.confirm("Bạn có chắc chắn muốn xóa danh mục này không?", function (result) {
                if (result) {
                    usersController.delete(id);
                };

            });
        });

        $('#txtSearch').change(function () {
            usersController.loadData(true);
        });


        $('#btn-refresh').off('click').on('click', function () {
            $('#txtSearch').val('');
            usersController.loadData(true);
        });



    },
    delete: function (id) {
        $.ajax({
            url: '/Users/Delete',
            data: { id: id },
            type: 'post',
            dataType: 'json',
            success: function (res) {
                if (res.status) {

                    toastr.success(res.message);
                    usersController.loadData(true);
                } else {
                    toastr.error(res.message);
                }
            }
        });
    },
    loadRoleList: function (id) {
        $.ajax({
            url: '/Users/RoleByUsers',
            data: {
                id: id
            },
            type: 'post',
            dataType: 'json',
            success: function (res) {
                if (res.status == true) {
                    var data = res.data;
                    var html = '';
                    var template = $('#data-Role').html();
                    $.each(data, function (i, item) {
                        html += Mustache.render(template, {
                            ID: item.Id,
                            RoleName: item
                        });
                    });
                    $('#tbRole').html(html);
                }
            }
        });
    }
    , loadData: function (changePageSize) {
        var search = $('#txtSearch').val();
        $.ajax({
            url: '/Users/GetAll',
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
                            ID: item.Id,
                            Account: item.UserName == null ? "NoN" : item.UserName,
                            FullName: item.FullName == null ? "NoN" : item.FullName,
                            PhoneNumber: item.PhoneNumber ? "NoN" : item.PhoneNumber,
                            Avatar: item.Avatar == null ? "/Assets/Upload/Avatar_person_user_character_man_woman_human-04-512.png" : item.Avatar,
                            BirthDay: item.BirthDay == null ? "NoN" : sharedController.parseDate(item.BirthDay),
                            Address: item.Address == null ? "NoN" : item.Address,
                            PhoneNumber: item.PhoneNumber == null ? "NoN" : item.PhoneNumber

                        });
                    });
                    $('#tbData').html(html);
                    var totalPage = Math.ceil(response.total / config.pageSize);
                    usersController.paging(response.total, function () {

                        usersController.loadData();
                        $('#currentpage').html(config.pageIndex);
                        $('#totalpage').html(totalPage);
                    }, changePageSize);
                    usersController.registerEvent();
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
usersController.init();