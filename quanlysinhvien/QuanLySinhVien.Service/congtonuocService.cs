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
    public interface ICongToNuocService
    {
        CongToNuoc Add(CongToNuoc CongToNuocs);

        void Update(CongToNuoc CongToNuocs);

        CongToNuoc Delete(int id);

        IEnumerable<CongToNuoc> GetAll();

        IEnumerable<CongToNuoc> GetAll(string keyword);

        CongToNuoc GetById(int id);

        CongToNuoc GetByName(string name);

        void Save();
    }
    public class CongToNuocServices : ICongToNuocService
    {
        private IcongtonuocRepository _CongToNuocsRepository;
        private IUnitOfWork _unitOfWork;
        public CongToNuocServices(IcongtonuocRepository CongToNuocsRepository,IUnitOfWork unitOfWork)
        {
            this._CongToNuocsRepository = CongToNuocsRepository;
            this._unitOfWork = unitOfWork;
        }
        public CongToNuoc Add(CongToNuoc CongToNuocs)
        {
            return _CongToNuocsRepository.Add(CongToNuocs);
        }

        public CongToNuoc Delete(int id)
        {
            return _CongToNuocsRepository.Delete(id);
        }

        public IEnumerable<CongToNuoc> GetAll()
        {
            return _CongToNuocsRepository.GetAll();
        }

        public IEnumerable<CongToNuoc> GetAll(string keyword)
        {
            if (!string.IsNullOrEmpty(keyword))
            {
                return _CongToNuocsRepository.GetMulti(x=>x.MaSoCongTo.Contains(keyword));
            }
            else
            {
                return _CongToNuocsRepository.GetAll();
            }
        }

        public CongToNuoc GetById(int id)
        {
            return _CongToNuocsRepository.GetSingleById(id);
        }

        public CongToNuoc GetByName(string name)
        {
            return _CongToNuocsRepository.GetSingleByCondition(x => x.MaSoCongTo == name);
        }

        public void Save()
        {
            _unitOfWork.Commit();
        }

        public void Update(CongToNuoc CongToNuocs)
        {
            _CongToNuocsRepository.Update(CongToNuocs);
        }
    }
}
