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
    [Table("Contract")]
    public  class Contract
    {
        [Key]
        [Column(Order =1)]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        public int StudentID { get; set; }
        public string UrlContract { get; set; }

        [Required(ErrorMessage ="Ngày tạo không được rỗng")]
        [DisplayName("Ngày tạo")]
        public DateTime CreatedDate { get; set; }

        [DisplayName("Ngày hết hạn")]
        public DateTime ExpireDate { get; set; }
 
        [DefaultValue(1)]
        public bool Status { get; set; }


    }
}
