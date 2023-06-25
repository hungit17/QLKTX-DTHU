namespace QuanLySinhVien.Data.Infrastructure
{
    public class DbFactory : Disposable, IDbFactory
    {
        private QuanLySinhVienDbContext dbcontext;

        public QuanLySinhVienDbContext Init()
        {
            return dbcontext ?? (dbcontext = new QuanLySinhVienDbContext());
        }

        protected override void DisposeCore()
        {
            if (dbcontext != null)
            {
                dbcontext.Dispose();
            }
        }
    }
}