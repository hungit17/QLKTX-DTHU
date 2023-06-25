using QuanLySinhVien.Data.Infrastructure;
using QuanLySinhVien.Models.Models;

namespace QuanLySinhVien.Data.Repositories
{
    public interface IcongtodienRepository : IRepository<CongToDien>
    {
    }

    public class congtodienRepository : RepositoryBase<CongToDien>, IcongtodienRepository
    {
        public congtodienRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }
    }
}