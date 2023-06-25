namespace QuanLySinhVien.Webs.Models.Identity
{

    using System.Data.Entity;

    public partial class QuanLySinhVienContext : DbContext
    {
        public QuanLySinhVienContext()
            : base("name=QuanLySinhVien")
        {
        }

        public virtual DbSet<AspNetRole> AspNetRoles { get; set; }
        public virtual DbSet<AspNetUser> AspNetUsers { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AspNetRole>()
                .HasMany(e => e.AspNetUsers)
                .WithMany(e => e.AspNetRoles)
                .Map(m => m.ToTable("AspNetUserRoles").MapLeftKey("RoleId").MapRightKey("UserId"));

        }

    }
}
