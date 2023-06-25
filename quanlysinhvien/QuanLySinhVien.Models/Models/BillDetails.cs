using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLySinhVien.Models.Models
{
    public class BillDetails
    {
        public int ID { get; set; }
        public int BillID { get; set; }
        public int RoomID { get; set; }
        public decimal TongTien { get; set; }
        public DateTime KyDau { get; set; }
        public DateTime KyCuoi { get; set; }
    }
}
