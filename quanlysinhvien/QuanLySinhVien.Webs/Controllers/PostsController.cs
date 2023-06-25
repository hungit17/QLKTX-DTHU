using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using AutoMapper;
using QuanLySinhVien.Common;
using QuanLySinhVien.Webs.Infrastructure.Extensions;
using QuanLySinhVien.Models.Models;
using QuanLySinhVien.Service;
using QuanLySinhVien.Webs.Models;
using LoHoiDaiLuc.Common;
using QuanLySinhVien.Webs.Authorize;

namespace QuanLySinhVien.Webs.Controllers
{
    public class PostsController : Controller
    {
        private IPostsServices _Posts;
        public PostsController(IPostsServices Posts)
        {
            this._Posts = Posts;
        }
        [CustomAuthorize(Roles = "SupperAdmin,Admin")]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult CheckExist(string name)
        {
            var result = true;
            var data = _Posts.GetByName(name);
            if (data != null)
                result = false;
            return Json(new
            {
                result = result
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [CustomAuthorize(Roles = "SupperAdmin,Admin")]
        public JsonResult Delete(int id)
        {
            var target = _Posts.Delete(id);
            _Posts.Save();
            return Json(new
            {
                message = ResultState.Delete_SUCCESS
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [CustomAuthorize(Roles = "SupperAdmin,Admin")]
        public JsonResult DeleteMul(int[] ids)
        {
            var count = ids.Count();
            foreach (var id in ids)
            {
                _Posts.Delete(id);
            }
            _Posts.Save();
            return Json(new
            {
                message = ResultState.Delete_SUCCESS + count + " bản ghi"
            }, JsonRequestBehavior.AllowGet);
        }
 
        // GET: Admin/GetAll
        [HttpGet]
        [CustomAuthorize(Roles = "SupperAdmin,Admin")]
        public JsonResult GetAll(string searchstr, int page, int pageSize = 5)
        {
            var model = _Posts.GetAll();
            if (!string.IsNullOrEmpty(searchstr))
            {
                model = _Posts.GetAll(searchstr);
            }

            var posts = Mapper.Map<IEnumerable<Posts>, IEnumerable<PostsViewModel>>(model);
            var data = posts.
                Skip((page - 1) * pageSize).
                Take(pageSize);
            int totalRow = posts.Count();

            return Json(new
            {
                data = data,
                total = totalRow,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [CustomAuthorize(Roles = "SupperAdmin,Admin")]
        public ActionResult GetDetail(int id)
        {
            var model = _Posts.GetById(id);
            return Json(new
            {
                status = true,
                data = model
            }, JsonRequestBehavior.AllowGet);
        }


        public JsonResult LoadPosts()
        {
            var data = _Posts.GetAll();
            var dataModel = Mapper.Map<IEnumerable<Posts>, IEnumerable<PostsViewModel>>(data);
            return Json(new
            {
                data = dataModel,
                status = true,
            }, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        [ValidateInput(false)]
        [CustomAuthorize(Roles = "SupperAdmin,Admin")]
        public JsonResult Post(string Posts)
        {
            string message = string.Empty;
            var jsonObj = new JavaScriptSerializer();
            var model = jsonObj.Deserialize<Posts>(Posts);
            model.CreatedDate = DateTime.Now;
            model.MetaTitle = StringHelper.ToUnsignString(model.Name);
            _Posts.Add(model);
            _Posts.Save();
            message = ResultState.Add_SUCCESS;
            return Json(new
            {
                message = message,
                status = true,
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [ValidateInput(false)]
        [CustomAuthorize(Roles = "SupperAdmin,Admin")]
        public JsonResult Put(string Posts)
        {
            string message = string.Empty;
            var jsonObj = new JavaScriptSerializer();
            var model = jsonObj.Deserialize<PostsViewModel>(Posts);

            var check = _Posts.GetById(model.ID);
            if (check != null)
            {
                check.UpdatePosts(model);
                check.MetaTitle = StringHelper.ToUnsignString(model.Name);
                _Posts.Update(check);
                _Posts.Save();
                message = ResultState.Update_SUCCESS;
            }
            return Json(new
            {
                message = message,
                status = true,
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [CustomAuthorize(Roles = "SupperAdmin,Admin")]
        public JsonResult ChangeStatus(int id)
        {
            var target = _Posts.GetById(id);
            target.Status = !target.Status;
            _Posts.Save();
            return Json(new
            {
                status = target.Status
            }, JsonRequestBehavior.AllowGet);
        }
    }
}

