using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QuanLySinhVien.Webs.Models
{
    public class PostsViewModel
    {
        public int ID { get; set; }

        public string Name { get; set; }

        public string Avatar { get; set; }

        public DateTime? CreatedDate { get; set; }

        public string Content { get; set; }

        public string MetaTitle { get; set; }
        public bool Status { get; set; }
        public string PostBy { get; set; }
    }
}