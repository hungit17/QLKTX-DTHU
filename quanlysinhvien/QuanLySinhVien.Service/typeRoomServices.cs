using QuanLySinhVien.Data.Infrastructure;
using QuanLySinhVien.Data.Repositories;
using QuanLySinhVien.Models.Models;
using System.Collections.Generic;

namespace QuanLySinhVien.Service
{
    public interface ItypeRoomServices
    {
        TypeRoom Add(TypeRoom TypeRoom);

        void Update(TypeRoom TypeRoom);

        TypeRoom Delete(int id);

        IEnumerable<TypeRoom> GetAll();

        TypeRoom GetById(int id);
        TypeRoom GetByName(string name);

        void Save();
    }
    public class TypeRoomServices : ItypeRoomServices
    {
        private ITypeRoomRepository _TypeRoomRepository;
        private IUnitOfWork _unitOfWork;
        public TypeRoomServices(ITypeRoomRepository TypeRoomRepository,IUnitOfWork unitOfWork)
        {
            this._TypeRoomRepository = TypeRoomRepository;
            this._unitOfWork = unitOfWork;
        }
        public TypeRoom Add(TypeRoom TypeRoom)
        {
            return _TypeRoomRepository.Add(TypeRoom);
        }

        public TypeRoom Delete(int id)
        {
            return _TypeRoomRepository.Delete(id);
        }

        public IEnumerable<TypeRoom> GetAll()
        {
            return _TypeRoomRepository.GetAll();
        }

        public TypeRoom GetById(int id)
        {
            return _TypeRoomRepository.GetSingleById(id);
        }

        public TypeRoom GetByName(string name)
        {
            return _TypeRoomRepository.GetSingleByCondition(x => x.TenLoaiPhong == name);
        }

        public void Save()
        {
            _unitOfWork.Commit();
        }

        public void Update(TypeRoom TypeRoom)
        {
            _TypeRoomRepository.Update(TypeRoom);
        }
    }
}
