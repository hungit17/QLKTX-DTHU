using QuanLySinhVien.Data.Infrastructure;
using QuanLySinhVien.Models.Models;

namespace QuanLySinhVien.Data.Repositories
{
    public interface IbillRepository : IRepository<Bill>
    {
    }

    public class billRepository : RepositoryBase<Bill>, IbillRepository
    {
        public billRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }
    }
}