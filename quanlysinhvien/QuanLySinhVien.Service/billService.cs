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
    public interface IBillService
    {
        Bill Add(Bill Bills);

        void Update(Bill Bills);

        Bill Delete(int id);

        IEnumerable<Bill> GetAll();

        Bill GetById(int id);

        void Save();
    }
    public class BillServices : IBillService
    {
        private IbillRepository _billsRepository;
        private IUnitOfWork _unitOfWork;
        public BillServices(IbillRepository billsRepository,IUnitOfWork unitOfWork)
        {
            this._billsRepository = billsRepository;
            this._unitOfWork = unitOfWork;
        }
        public Bill Add(Bill Bills)
        {
            return _billsRepository.Add(Bills);
        }

        public Bill Delete(int id)
        {
            return _billsRepository.Delete(id);
        }

        public IEnumerable<Bill> GetAll()
        {
            return _billsRepository.GetAll();
        }

  

        public Bill GetById(int id)
        {
            return _billsRepository.GetSingleById(id);
        }

      
        public void Save()
        {
            _unitOfWork.Commit();
        }

        public void Update(Bill Bills)
        {
            _billsRepository.Update(Bills);
        }
    }
}
