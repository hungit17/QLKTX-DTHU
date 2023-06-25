using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using QuanLySinhVien.Models.Models;
using System.Data.Entity;
using System.Security.Claims;
using System.Threading.Tasks;

namespace QuanLySinhVien.Data
{
    public class QuanLySinhVienDbContext : IdentityDbContext
    {
        public QuanLySinhVienDbContext() : base("QuanLySinhVien")
        {
            this.Configuration.LazyLoadingEnabled = false;
        }
        public DbSet<Students> Students{ set; get; }
        public DbSet<Room> Rooms{ set; get; }
        public DbSet<Bill> Bills { set; get; }
        public DbSet<Contract> Contracts { get; set; }
        public DbSet<Posts> Posts { get; set; }
        public static QuanLySinhVienDbContext Create()
        {
            return new QuanLySinhVienDbContext();
        }
       
        protected override void OnModelCreating(DbModelBuilder builder)
        {
            Database.SetInitializer<QuanLySinhVienDbContext>(null);
            base.OnModelCreating(builder);
        }
    }
}