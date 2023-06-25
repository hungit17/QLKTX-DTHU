using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLySinhVien.Models.Models
{
    [Table("Bill")]
    public class Bill
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        public int RoomID { get; set; }

        [Required]
        public DateTime CreatedDate{ get; set; }

        public decimal? TienDien { get; set; }
        public decimal? TienNuoc { get; set; }

        [DisplayName("Tiền phòng")]
        public decimal? TienPhong { get; set; }
        public decimal? TongTien { get; set; }
        public DateTime NgayThu { get; set; }
   
        [DisplayName("Tình trạng thu")]
        [DefaultValue(0)]
        public bool Status { get; set; }
        [ForeignKey("RoomID")]
        public virtual Room Room { get; set; }
    }
}
