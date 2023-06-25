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
    public interface ICongToDienService
    {
        CongToDien Add(CongToDien CongToDiens);

        void Update(CongToDien CongToDiens);

        CongToDien Delete(int id);

        IEnumerable<CongToDien> GetAll();

        IEnumerable<CongToDien> GetAll(string keyword);

        CongToDien GetById(int id);
        CongToDien GetByName(string name);

        void Save();
    }
    public class CongToDienServices : ICongToDienService
    {
        private IcongtodienRepository _CongToDiensRepository;
        private IUnitOfWork _unitOfWork;
        public CongToDienServices(IcongtodienRepository CongToDiensRepository,IUnitOfWork unitOfWork)
        {
            this._CongToDiensRepository = CongToDiensRepository;
            this._unitOfWork = unitOfWork;
        }
        public CongToDien Add(CongToDien CongToDiens)
        {
            return _CongToDiensRepository.Add(CongToDiens);
        }

        public CongToDien Delete(int id)
        {
            return _CongToDiensRepository.Delete(id);
        }

        public IEnumerable<CongToDien> GetAll()
        {
            return _CongToDiensRepository.GetAll();
        }

        public IEnumerable<CongToDien> GetAll(string keyword)
        {
            if (!string.IsNullOrEmpty(keyword))
            {
                return _CongToDiensRepository.GetMulti(x => x.MaSoCongTo.Contains(keyword));
            }
            else
            {
                return _CongToDiensRepository.GetAll();
            }
        }


        public CongToDien GetById(int id)
        {
            return _CongToDiensRepository.GetSingleById(id);
        }

        public CongToDien GetByName(string name)
        {
            return _CongToDiensRepository.GetSingleByCondition(x => x.MaSoCongTo == name);
        }

        public void Save()
        {
            _unitOfWork.Commit();
        }

        public void Update(CongToDien CongToDiens)
        {
            _CongToDiensRepository.Update(CongToDiens);
        }
    }
}
