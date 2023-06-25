using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace QuanLySinhVien.Webs.Models
{
    public class MyClassViewModel
    {
        public int ID { get; set; }
        [DisplayName("Mã lớp")]
        public string ClassCode { get; set; }
        [DisplayName("Tên lớp")]
        public string ClassName { get; set; }
        public int Departments_ID { get; set; }
    }
}