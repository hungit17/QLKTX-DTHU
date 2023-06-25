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
   public class CongToDien
    {
      
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        [DisplayName("Mã số công tơ")]
        public string MaSoCongTo { get; set; }
        [DisplayName("Chỉ số củ")]
        public float ChiSoCu { get; set; }
        [DisplayName("Chỉ số mới")]
        public float ChiSoMoi { get; set; }
        [DisplayName("Tiêu thụ")]
        public float TieuThu { get; set; }
        [DisplayName("Tổng tiền")]
        public decimal? TongTien { get; set; }
    }
}
