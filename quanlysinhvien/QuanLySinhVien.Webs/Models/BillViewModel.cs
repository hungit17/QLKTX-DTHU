using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace QuanLySinhVien.Webs.Models
{
    public class BillViewModel
    {
        public int ID { get; set; }

        [DisplayName("Mã phòng")]
        public int RoomID { get; set; }
        [DisplayName("Ngày tạo")]
        public DateTime CreatedDate { get; set; }
        public decimal?  TienDien { get; set; }
        public decimal?  TienNuoc { get; set; }
     
        public decimal?  TienPhong { get; set; }
        public decimal? TongTien { get; set; }
        public DateTime NgayThu { get; set; }
        [DefaultValue(0)]
        public bool Status { get; set; }

    }
}