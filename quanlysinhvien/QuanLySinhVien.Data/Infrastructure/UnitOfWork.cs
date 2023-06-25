namespace QuanLySinhVien.Data.Infrastructure
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly IDbFactory dbFactory;
        private QuanLySinhVienDbContext dbContext;

        public UnitOfWork(IDbFactory dbFactory)
        {
            this.dbFactory = dbFactory;
        }

        public QuanLySinhVienDbContext DbContext
        {
            get
            {
                return dbContext ?? (dbContext = dbFactory.Init());
            }
        }

        public void Commit()
        {
            DbContext.SaveChanges();
        }
    }
}