using QuanLySinhVien.Data.Infrastructure;
using QuanLySinhVien.Models.Models;

namespace QuanLySinhVien.Data.Repositories
{
    public interface IRoomRepository : IRepository<Room>
    {
    }

    public class RoomRepository : RepositoryBase<Room>, IRoomRepository
    {
        public RoomRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }
    }
}