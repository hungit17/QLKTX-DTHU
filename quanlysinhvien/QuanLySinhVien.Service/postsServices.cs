using QuanLySinhVien.Data.Infrastructure;
using QuanLySinhVien.Data.Repositories;
using QuanLySinhVien.Models.Models;
using System.Collections.Generic;

namespace QuanLySinhVien.Service
{
    public interface IPostsServices
    {
        Posts Add(Posts posts);

        void Update(Posts posts);

        Posts Delete(int id);

        IEnumerable<Posts> GetAll();

        IEnumerable<Posts> GetAll(string keyword);

        Posts GetById(int id);
        Posts GetByName(string name);

        void Save();
    }
    public class PostsServices : IPostsServices
    {
        private IPostsRepository _postsRepository;
        private IUnitOfWork _unitOfWork;
        public PostsServices(IPostsRepository postsRepository,IUnitOfWork unitOfWork)
        {
            this._postsRepository = postsRepository;
            this._unitOfWork = unitOfWork;
        }
        public Posts Add(Posts posts)
        {
            return _postsRepository.Add(posts);
        }

        public Posts Delete(int id)
        {
            return _postsRepository.Delete(id);
        }

        public IEnumerable<Posts> GetAll()
        {
            return _postsRepository.GetAll();
        }

        public IEnumerable<Posts> GetAll(string keyword)
        {

                return _postsRepository.GetMulti(x=>x.Name.Contains(keyword));
        }

        public Posts GetById(int id)
        {
            return _postsRepository.GetSingleById(id);
        }

        public Posts GetByName(string name)
        {
            return _postsRepository.GetSingleByCondition(x => x.Name == name);
        }

        public void Save()
        {
            _unitOfWork.Commit();
        }

        public void Update(Posts posts)
        {
            _postsRepository.Update(posts);
        }
    }
}
