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
    public class Users
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        public string UserName { get; set; }
        public string Avatar { get; set; }
        public string FullName { get; set; }
        public DateTime BirthDay { get; set; }
        public string Address { get; set; }

    }
}
