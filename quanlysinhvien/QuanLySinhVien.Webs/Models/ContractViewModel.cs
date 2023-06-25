using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace QuanLySinhVien.Webs.Models
{
    public class ContractViewModel
    {
        public int ID { get; set; }
        [DisplayName("Mã sinh viên")]
        public int StudentID { get; set; }
        public string UrlContract { get; set; }

        [DisplayName("Ngày tạo")]
        public DateTime CreatedDate { get; set; }
        [DisplayName("Ngày hết hạn")]
        public DateTime ExpireDate { get; set; }
        [DisplayName("Trạng thái")]
        public bool Status { get; set; }


    }
}