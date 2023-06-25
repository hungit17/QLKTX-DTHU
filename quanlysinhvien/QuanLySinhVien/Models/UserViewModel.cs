using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QuanLySinhVien.Models
{
    public class UserViewModel
    {
        public int ID { get; set; }

        public string UserName { get; set; }

        public string Password { get; set; }
        public string Avatar { get; set; }
        public DateTime? CreatedDate { get; set; }

    }
}