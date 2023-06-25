using QuanLySinhVien.Data.Infrastructure;
using QuanLySinhVien.Models.Models;

namespace QuanLySinhVien.Data.Repositories
{
    public interface ITypeRoomRepository : IRepository<TypeRoom>
    {
    }

    public class typeRoomRepository : RepositoryBase<TypeRoom>, ITypeRoomRepository
    {
        public typeRoomRepository(IDbFactory dbFactory) : base(dbFactory)
        {
        }
    }
}