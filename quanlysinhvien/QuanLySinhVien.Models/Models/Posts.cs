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
    [Table("Posts")]
    public class Posts
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        [DisplayName("Tên bài viết")]
        public string Name { get; set; }
        [DisplayName("Hình đại diện")]
        public string Avatar { get; set; }
        [DisplayName("Ngày viết")]
        public DateTime? CreatedDate { get; set; }
        [DisplayName("Nội dung")]
        public string Content { get; set; }

        public string MetaTitle { get; set; }
        public bool Status { get; set; }
        public string PostBy { get; set; }
    }
}
