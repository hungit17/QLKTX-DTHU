using QuanLySinhVien.Data.Infrastructure;
using QuanLySinhVien.Models.Models;

namespace QuanLySinhVien.Data.Repositories
{
    public interface IContractRepository : IRepository<Contract>
    {
    }

    public class contractRepository : RepositoryBase<Contract>, IContractRepository
    {
        public contractRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }
    }
}