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
    public interface IcontractService
    {
        Contract Add(Contract contracts);

        void Update(Contract contracts);

        Contract Delete(int id);

        IEnumerable<Contract> GetAll();

        IEnumerable<Contract> GetAll(string keyword);

        Contract GetById(int id);
        Contract GetByIdCondition(int id);

        void Save();
    }
    public class contractServices : IcontractService
    {
        private IContractRepository _contractsRepository;
        private IUnitOfWork _unitOfWork;
        public contractServices(IContractRepository contractsRepository,IUnitOfWork unitOfWork)
        {
            this._contractsRepository = contractsRepository;
            this._unitOfWork = unitOfWork;
        }
        public Contract Add(Contract contracts)
        {
            return _contractsRepository.Add(contracts);
        }

        public Contract Delete(int id)
        {
            return _contractsRepository.Delete(id);
        }

        public IEnumerable<Contract> GetAll()
        {
            return _contractsRepository.GetAll();
        }

        public IEnumerable<Contract> GetAll(string keyword)
        {

                return _contractsRepository.GetAll();
        }

        public Contract GetById(int id)
        {
            return _contractsRepository.GetSingleById(id);
        }

        public Contract GetByIdCondition(int id)
        {
            return _contractsRepository.GetSingleByCondition(x => x.ID == id);
        }

        public void Save()
        {
            _unitOfWork.Commit();
        }

        public void Update(Contract contracts)
        {
            _contractsRepository.Update(contracts);
        }
    }
}
