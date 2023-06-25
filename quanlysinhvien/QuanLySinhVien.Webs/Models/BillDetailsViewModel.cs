using System;
using System.ComponentModel;


namespace QuanLySinhVien.Webs.Models
{
    public class BillDetailsViewModel
    {
        public int ID { get; set; }
        public int BillID { get; set; }
        public int RoomID { get; set; }
        public decimal TongTien { get; set; }
        public DateTime KyDau { get; set; }
        public DateTime KyCuoi { get; set; }

    }
}