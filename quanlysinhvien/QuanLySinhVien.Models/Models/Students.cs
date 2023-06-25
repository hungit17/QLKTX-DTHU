using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLySinhVien.Models.Models
{
    [Table("Students")]
    public class Students
    {
        [Key]
        [Column(Order =0)]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
       
        [DisplayName("Tên sinh viên")]
        [Required(ErrorMessage ="Tên sinh viên không được bỏ trống")]
        [StringLength(256)]
        public string  Name { get; set; }

        [DisplayName("Ngày sinh")]
        public DateTime? BirthDay { get; set; }
        
        [DefaultValue(1)]
        public int Gender { get; set; }

        [DisplayName("Hình đại diện")]
        [StringLength(256)]
        public string Avatar { get; set; }

        [DisplayName("Ngày tạo")]
        [DefaultValue(DataType.DateTime)]
        public DateTime? CreateDate { get; set; }

        [DisplayName("Ngày tạo")]
        [DefaultValue(DataType.DateTime)]
        public DateTime? UpdatedDate { get; set; }

        [DisplayName("Địa chỉ")]
        [StringLength(256)]
        public string Address { get; set; }

        [DisplayName("Tên lớp")]
        public string ClassName { get; set; }

        [DisplayName("Mã phòng")]
        public int? RoomID { get; set; }
        public int Contracts_ID { get; set; }

        [DisplayName("Số điện thoại")]
        [StringLength(50)]
        public string PhoneNumber { get; set; }
        [DisplayName("Địa chỉ Email")]
        [StringLength(50)]
        public string Email { get; set; }

        [DisplayName("Miêu tả sinh viên")]
        public string ContentDescription { get; set; }
        [ForeignKey("RoomID")]
        public virtual Room Room { get; set; }
        [ForeignKey("Contracts_ID")]
        public virtual Contract Contracts { get; set; }
    }
}
