using QuanLySinhVien.Data.Infrastructure;
using QuanLySinhVien.Models.Models;

namespace QuanLySinhVien.Data.Repositories
{
    public interface IbillDetailsRepository : IRepository<BillDetails>
    {
    }

    public class BillDetailsRepository : RepositoryBase<BillDetails>, IbillDetailsRepository
    {
        public BillDetailsRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }
    }
}