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
    [Table("Room")]
    public class Room
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        [Required(ErrorMessage ="Yâu cầu nhập mã phòng")]
        public string RoomCode { get; set; }

        public int MaSoCongToDien { get; set; }
        public int? SoSV { get; set; }
        public decimal? GiaPhong { get; set; }

        public int MaSoCongToNuoc { get; set; }
        public int TypeRoomID { get; set; }

        [Required(ErrorMessage ="Tên phòng không được trống")]
        [DisplayName("Tên phòng")]
        public string RoomName { get; set; }

        [DisplayName("Miêu tả")]
        public string Description { get; set; }

        [DefaultValue(1)]
        public bool Status { get; set; }


        [ForeignKey("MaSoCongToDien")]
        public virtual CongToDien CongToDiens { get; set; }

        [ForeignKey("MaSoCongToNuoc")]
        public virtual CongToNuoc CongToNuocs { get; set; }
        public virtual IEnumerable<Students> Students{ get; set; }
        [ForeignKey("TypeRoomID")]
        public virtual TypeRoom TypeRoom { get; set; }
    }
}
