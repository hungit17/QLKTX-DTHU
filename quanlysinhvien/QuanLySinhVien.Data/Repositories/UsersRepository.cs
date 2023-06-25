using QuanLySinhVien.Data.Infrastructure;
using QuanLySinhVien.Models.Models;

namespace QuanLySinhVien.Data.Repositories
{
    public interface IUsersRepository : IRepository<Bill>
    {
    }

    public class UsersRepository : RepositoryBase<Bill>, IUsersRepository
    {
        public UsersRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }
    }
}