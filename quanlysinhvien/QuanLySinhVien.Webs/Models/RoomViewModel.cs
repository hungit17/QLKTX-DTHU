using Microsoft.AspNet.Identity.EntityFramework;
using QuanLySinhVien.Webs.Models.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QuanLySinhVien.Webs.Models
{
    public class RoomViewModel
    {
        public int ID { get; set; }

        [DisplayName("Mã phòng")]
        public string RoomCode { get; set; }

        [DisplayName("Tên phòng")]
        public string RoomName { get; set; }
        public int TypeRoomID { get; set; }
        public int? SoSv { get; set; }
        public int? GiaPhong { get; set; }

        public int MaSoCongToDien { get; set; }

        public int MaSoCongToNuoc { get; set; }

        [UIHint("tinymce_jquery_full"),AllowHtml]
        [DisplayName("Miêu tả")]
        public string Description { get; set; }

        [DisplayName("Trạng thái")]
        public bool Status { get; set; }
    }
}