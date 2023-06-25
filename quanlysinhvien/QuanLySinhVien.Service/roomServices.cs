using QuanLySinhVien.Data.Infrastructure;
using QuanLySinhVien.Data.Repositories;
using QuanLySinhVien.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLySinhVien.Service
{
    public interface IroomService
    {
        Room Add(Room rooms);

        void Update(Room rooms);

        Room Delete(int id);

        IEnumerable<Room> GetAll();

        IEnumerable<Room> GetAll(string keyword);

        Room GetById(int id);
        Room GetByIdCondition(int? id);

        Room GetByName(string name);

        void Save();
    }
    public class RoomServices : IroomService
    {
        private IRoomRepository _roomsRepository;
        private IUnitOfWork _unitOfWork;
        public RoomServices(IRoomRepository roomsRepository,IUnitOfWork unitOfWork)
        {
            this._roomsRepository = roomsRepository;
            this._unitOfWork = unitOfWork;
        }
        public Room Add(Room rooms)
        {
            return _roomsRepository.Add(rooms);
        }

        public Room Delete(int id)
        {
            return _roomsRepository.Delete(id);
        }

        public IEnumerable<Room> GetAll()
        {
            return _roomsRepository.GetAll();
        }

        public IEnumerable<Room> GetAll(string keyword)
        {
            if (!string.IsNullOrEmpty(keyword))
            {
                return _roomsRepository.GetMulti(x => x.RoomName.Contains(keyword));
            }
            else
            {
                return _roomsRepository.GetAll();
            }
        }

        public Room GetById(int id)
        {
            return _roomsRepository.GetSingleById(id);
        }
        public Room GetByIdCondition(int? studentID)
        {
            return _roomsRepository.GetSingleByCondition(x => x.ID == studentID);
        }
        public Room GetByName(string name)
        {
            return _roomsRepository.GetSingleByCondition(x => x.RoomCode == name);
        }
        
        public void Save()
        {
            _unitOfWork.Commit();
        }

        public void Update(Room rooms)
        {
            _roomsRepository.Update(rooms);
        }
    }
}
