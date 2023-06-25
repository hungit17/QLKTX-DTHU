using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace QuanLySinhVien.Webs.Models
{
    public class DepartmentViewModel
    {
        public int ID { get; set; }
        [DisplayName("Mã khoa")]
        public string DepartmentCode { get; set; }
        [DisplayName("Tên khoa")]
        public string DepartmentName { get; set; }
    }
}