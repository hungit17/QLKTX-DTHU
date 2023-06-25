using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QuanLySinhVien.Models
{
    public class StudentsViewModel
    {
        public int ID { get; set; }

        public string Name { get; set; }

        public DateTime BirthDay { get; set; }
        public string Avatar { get; set; }
        public DateTime? CreateDate { get; set; }
        public bool Status { get; set; }
        public string Address { get; set; }
        public string ContentDescription { get; set; }
    }
}