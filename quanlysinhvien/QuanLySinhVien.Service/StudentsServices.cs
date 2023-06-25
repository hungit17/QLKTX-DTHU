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
    public interface IStudentService
    {
        Students Add(Students students);

        void Update(Students students);

        Students Delete(int id);

        IEnumerable<Students> GetAll();

        IEnumerable<Students> GetAll(string keyword);

        Students GetById(int id);

        Students GetByName(string name);

        void Save();
    }
    public class StudentServices : IStudentService
    {
        private IStudentsRepository _studentsRepository;
        private IUnitOfWork _unitOfWork;
        public StudentServices(IStudentsRepository studentsRepository,IUnitOfWork unitOfWork)
        {
            this._studentsRepository = studentsRepository;
            this._unitOfWork = unitOfWork;
        }
        public Students Add(Students students)
        {
            return _studentsRepository.Add(students);
        }

        public Students Delete(int id)
        {
            return _studentsRepository.Delete(id);
        }

        public IEnumerable<Students> GetAll()
        {
            return _studentsRepository.GetAll();
        }

        public IEnumerable<Students> GetAll(string keyword)
        {
            if (!string.IsNullOrEmpty(keyword))
            {
                return _studentsRepository.GetMulti(x => x.Name.Contains(keyword));
            }
            else
            {
                return _studentsRepository.GetAll();
            }
        }

        public Students GetById(int id)
        {
            return _studentsRepository.GetSingleById(id);
        }

        public Students GetByName(string name)
        {
            return _studentsRepository.GetSingleByCondition(x => x.Name == name);
        }

        public void Save()
        {
            _unitOfWork.Commit();
        }

        public void Update(Students students)
        {
            _studentsRepository.Update(students);
        }
    }
}
