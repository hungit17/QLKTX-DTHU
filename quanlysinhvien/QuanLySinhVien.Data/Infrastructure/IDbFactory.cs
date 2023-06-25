using System;

namespace QuanLySinhVien.Data.Infrastructure
{
    public interface IDbFactory : IDisposable
    {
        QuanLySinhVienDbContext Init();
    }
}