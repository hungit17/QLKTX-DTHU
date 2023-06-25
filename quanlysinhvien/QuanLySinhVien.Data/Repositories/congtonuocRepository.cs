using QuanLySinhVien.Data.Infrastructure;
using QuanLySinhVien.Models.Models;

namespace QuanLySinhVien.Data.Repositories
{
    public interface IcongtonuocRepository : IRepository<CongToNuoc>
    {
    }

    public class congtonuocRepository : RepositoryBase<CongToNuoc>, IcongtonuocRepository
    {
        public congtonuocRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }
    }
}