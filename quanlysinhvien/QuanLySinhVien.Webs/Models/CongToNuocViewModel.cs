using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace QuanLySinhVien.Webs.Models
{
    public class CongToNuocViewModel
    {
        public int ID { get; set; }
        public string MaSoCongTo { get; set; }
    
        public float ChiSoCu { get; set; }
     
        public float ChiSoMoi { get; set; }
        public float TieuThu { get; set; }
        public decimal? TongTien { get; set; }
    }
}