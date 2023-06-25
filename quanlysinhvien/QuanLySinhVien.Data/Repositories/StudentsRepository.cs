using QuanLySinhVien.Data.Infrastructure;
using QuanLySinhVien.Models.Models;

namespace QuanLySinhVien.Data.Repositories
{
    public interface IStudentsRepository : IRepository<Students>
    {
    }

    public class StudentsRepository : RepositoryBase<Students>, IStudentsRepository
    {
        public StudentsRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }
    }
}