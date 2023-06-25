var config = {
    pageSize: 20,
    pageIndex: 1

}
var profileController = {

    init: function () {
        profileController.registerEvent();
    },
    registerEvent: function () {
        $('.frmSaveData').validate({
            rules: {
                Name: "required",
                BirthDay: "required",
                Gender: "required",
                PhoneNumber: { number: true },
                Email: "required",
            },
            messages: {
                Name: "Bạn phải nhập tên đầy đủ",
                BirthDay: "Tên tài khoản là bắt buộc",
                Email: "Vui lòng nhập Email",
                PhoneNumber: "Số điện thoại không hợp lệ",
                Gender: "Giới tính",

            }

        });
        $('.frmSavePass').validate({
            rules: {
                NewPassword: {
                    required:true,
                    minlength: 8,
                    },
                ConfirmPassword: {
                    equalTo: '[name="NewPassword"]'
                }
            },
            messages: {
                NewPassword: 'Mật khẩu mới được bắt buộc',
                ConfirmPassword: 'Mật khẩu không trùng khớp'
            }

        });
        $('#Avatar').load(function () {
            var avatar = $('#Avatar').attr('src');
            var id = $('#txtID').val();
            if (avatar != null) {
                $.ajax({
                    url: '/Account/UpdateAvatar',
                    data: {
                        avatar: avatar,
                        id: id
                    },
                    type: 'post',
                    dataType: 'json',
                    success: function (res) {
                        if (res.status == true) {
                            toastr.success("Đã cập nhật avatar!");
                            var avatar = $('#Avatar').attr('src', avatar);
                        } else {
                            toastr.err("Lỗi cập nhật");
                        }
                    }
                });
            }
        });
        $('#btnBack').off('click').on('click', function () {
            window.open('/Home/Index', '_parent')
        });
      
        $('#btnEdit').off('click').on('click', function () {
            $('#modalProfile').modal('show');
            var id = $(this).data('id');
            profileController.loadDetail(id)
        });
        $('#btnSave').off('click').on('click', function () {
            var id = $('#txtID').val();
            if ($('#frmSaveData').valid()) { 
                profileController.saveData(id);
            }
        });
        $('#btnSavePass').off('click').on('click', function () {
            var id = $('#changePassword').data('id');
            profileController.checkPassword(id);
            
        });
        $('#btnChangePassword').on('click', function () {
            $('#modalChangePassword').modal('show');
        });
     
        $('#btnChangeImage').on('click', function (e) {

            e.preventDefault();
            var finder = new CKFinder();
            finder.selectActionFunction = function (url) {
                $("#Avatar").attr('src', url);
            };

            finder.popup();
            $('#btnUpload').attr('disabled',false);
        });
    },
    updateProfile: function () {
        var avatar = $('#Avartar').attr('src');
        $.ajax({
            url: '/Partial/UpdateProfile',
            data: {
                avatar: avatar
            },
            type: 'post',
            dataType: 'json',
            success: function (res) {
                if (res.data) {

                    bootbox.alert("Đã cập nhật", function () {
                        location.reload();
                    });
                } else {
                    bootbox.alert("Lỗi cập nhật", function () {
                        location.reload();
                    });
                }
            }
        });
    },
    loadDetail: function (id) {
       
        $.ajax({
            url: '/Users/LoadDetail',
            data: {
                id: id
            },
            type: 'post',
            dataType: 'json',
            success: function (res) {
                if (res.status) {
                    var data = res.data;
                    $('#txtName').val(data.FullName);
                    $('#txtBirthDay').val(data.Birthday);
                    $('input[name=gender]:checked').val(data.Gender);
                    $('#txtAddress').val(data.Address);
                    $('#txtPhoneNumber').val(data.PhoneNumber);
                    $('#txtEmail').val(data.Email);


                } else {
                    toastr.error(res.message);
                }
            }
        });
    },

    checkPassword: function (id) {
        var pass = $('#txtCurrentPassword').val();
        $.ajax({
            url: '/User/CheckPassword',
            data: {
                id: id,
                Password: pass
            },
            dataType: 'json',
            type: 'Product',
            success: function (res) {
                if (res.status==false) {
                    $('.validate').html('Sai mật khẩu');
                } else {
                    $('.validate').html('');
                    if ($('.frmSavePass').valid()) {
                        profileController.savePassword(id);
                        $('#modalChangePassword').modal('hide');
                    }
                }
            }
        })
    },
    savePassword:function(id){
        var pass = $('#txtNewPassword').val();
        $.ajax({
            url: '/User/SavePassword',
            data:{Password:pass,id:id},
            type: 'Product',
            dataType: 'json',
            success: function (res) {
                if(res.status)
                {
                    bootbox.alert("Đã cập nhật mật khẩu", function () {
                        window.open('/Login/Index');
                    });
                } else {
                    bootbox.alert("Lỗi cập nhật");
                }
            }
        })
    },
    saveData: function (id) {

        if (id != null) {
            var avatar = $('#txtAvatarUrl').val();
            var fullName = $('#txtName').val();
            var fullName = $('#txtName').val();
            var userName = $('#txtUserName').val();
            var birthDay = $('#txtBirthDay').val();
            var gender = $('input[name=Gender]:checked').val()==1?true:false;
            var email = $('#txtEmail').val();
            var phone = $('#txtPhoneNumber').val();
            var address = $('#txtAddress').val();
        }
        var user = {
            ID: id,
            Avatar:avatar,
            FullName: fullName,
            UserName: userName,
            Birthday: birthDay,
            Gender: gender,
            Email: email,
            PhoneNumber: phone,
            Address: address
        }
        $.ajax({
            url: '/Users/SaveData',
            data: {
                strUser: JSON.stringify(user)
            },
            type: 'post',
            dataType: 'json',
            success: function (response) {
                if (response.status == true) {
                    toastr.success(response.message);
                        location.reload();
         

                } else {
                    $('#modalEdit').modal('hide');

                    bootbox.alert(response.message);
                }
            },
            error: function (err) {
                alert(err);
            }
        });
    }
}
profileController.init();