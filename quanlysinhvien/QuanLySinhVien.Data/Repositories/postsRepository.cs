using QuanLySinhVien.Data.Infrastructure;
using QuanLySinhVien.Models.Models;

namespace QuanLySinhVien.Data.Repositories
{
    public interface IPostsRepository : IRepository<Posts>
    {
    }

    public class postsRepository : RepositoryBase<Posts>, IPostsRepository
    {
        public postsRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }
    }
}