using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace QuanLySinhVien.Webs.Models.Identity
{
    public class ExternalLoginConfirmationViewModel
    {
        [Required]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }

    public class ExternalLoginListViewModel
    {
        public string ReturnUrl { get; set; }
    }

    public class SendCodeViewModel
    {
        public string SelectedProvider { get; set; }
        public ICollection<System.Web.Mvc.SelectListItem> Providers { get; set; }
        public string ReturnUrl { get; set; }
        public bool RememberMe { get; set; }
    }

    public class VerifyCodeViewModel
    {
        [Required]
        public string Provider { get; set; }

        [Required]
        [Display(Name = "Code")]
        public string Code { get; set; }

        public string ReturnUrl { get; set; }

        [Display(Name = "Remember this browser?")]
        public bool RememberBrowser { get; set; }

        public bool RememberMe { get; set; }
    }

    public class ForgotViewModel
    {
        [Required]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }

    public class LoginViewModel
    {
        [Required(ErrorMessage ="Email bắt buộc nhập")]
        [Display(Name = "E-Mail")]
        [EmailAddress(ErrorMessage ="Địa chỉ email không hợp lệ")]
        public string Email { get; set; }

        [Required(ErrorMessage ="Mật khẩu bắt buộc nhập")]
        [DataType(DataType.Password)]
        [Display(Name = "Mật khẩu")]
        public string Password { get; set; }

        [Display(Name = "Nhớ đăng nhập?")]
        public bool RememberMe { get; set; }
    }

    public class RegisterViewModel
    {
        [Required(ErrorMessage ="Yêu cầu nhập email")]
        [EmailAddress(ErrorMessage ="Địa chỉ email không hợp lệ")]
        [Display(Name = "E-Mail")]
        public string Email { get; set; }

        [Required(ErrorMessage ="Yêu cầu nhập mật khẩu")]
        [StringLength(100, ErrorMessage = "{0} phải ít nhất {2} ký tự.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Mật khẩu")]
        public string Password { get; set; }

        [Required(ErrorMessage ="Yêu cầu nhập xác thực mật khẩu")]
        [DataType(DataType.Password)]
        [Display(Name = "Xác nhận mật khẩu")]
        [Compare("Password", ErrorMessage = "Mật khẩu và mật khẩu xác nhận không trùng khớp")]
        public string ConfirmPassword { get; set; }

        [Display(Name = "Hình đại diện")]
        [StringLength(250,ErrorMessage ="Chiều dài không được vượt quá 250 ký tự")]
        public string Avatar { get; set; }

        [Display(Name = "Tên tài khoản")]
        [StringLength(250, ErrorMessage = "Chiều dài không được vượt quá 250 ký tự")]
        public string UserName { get; set; }
        [Required(ErrorMessage = "Yêu cầu nhập tên của bạn")]
        [Display(Name = "Họ tên")]
        [StringLength(250, ErrorMessage = "Chiều dài không được vượt quá 250 ký tự")]
        public string FullName { get; set; }
    }

    public class ResetPasswordViewModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "{0} Phải ít nhất {2} Ký tự.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Mật khẩu")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Xác nhận mật khẩu")]
        [Compare("Password", ErrorMessage = "Mật khẩu xác nhật không trùng khớp")]
        public string ConfirmPassword { get; set; }

        public string Code { get; set; }
    }

    public class ForgotPasswordViewModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }
}