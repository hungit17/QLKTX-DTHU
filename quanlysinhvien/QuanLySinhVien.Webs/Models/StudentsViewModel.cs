using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.ModelBinding;

namespace QuanLySinhVien.Webs.Models
{
    public class StudentsViewModel
    {
        public int ID { get; set; }
        [DisplayName("Tên sinh viên")]
        public string Name { get; set; }
        [DisplayName("Ngày sinh")]
        [DataType(DataType.DateTime)]
        [DisplayFormat(DataFormatString = "{0:MM/dd/yyyy}", ApplyFormatInEditMode = true)]
        public DateTime BirthDay { get; set; }
        [DisplayName("Giới tính")]
        public int Gender { get; set; }
        [DisplayName("Hình đại diện")]
        public string Avatar { get; set; }
        [DisplayName("Ngày đăng ký")]
        [DataType(DataType.DateTime)]
        [DisplayFormat(DataFormatString = "{0:MM/dd/yyyy}", ApplyFormatInEditMode = true)]
        public DateTime? CreateDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        [DisplayName("Số điện thoại")]
        public string PhoneNumber { get; set; }
        [DisplayName("Địa chỉ email")]
        public string Email { get; set; }
        [DisplayName("Tên lớp")]
        public string ClassName { get; set; }

        [DisplayName("Địa chỉ")]
        public string Address { get; set; }
        public int? RoomID { get; set; }

        public int ClassID { get; set; }
        public int Contracts_ID { get; set; }

        [DisplayName("Miêu tả")]
        public string ContentDescription { get; set; }
    }   
}