using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using static QuanLySinhVien.Data.QuanLySinhVienDbContext;

namespace QuanLySinhVien.Webs.Models
{
    public class TypeRoomViewModel
    { 
        public int MaLoaiPhong { get; set; }
        public string TenLoaiPhong { get; set; }
    }
}