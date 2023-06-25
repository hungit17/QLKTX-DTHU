using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using AutoMapper;
using Kendo.Mvc.Extensions;
using QuanLySinhVien.Common;
using QuanLySinhVien.Models.Models;
using QuanLySinhVien.Service;
using QuanLySinhVien.Webs.Authorize;
using QuanLySinhVien.Webs.Models.Identity;
using System.Web.Script.Serialization;
using QuanLySinhVien.Webs.Models;
using QuanLySinhVien.Webs.Infrastructure.Extensions;

namespace QuanLySinhVien.Webs.Controllers
{
    [Authorize]
    public class TypeRoomController : BaseController
    {
        private ItypeRoomServices _TypeRoomService;
        public TypeRoomController(ItypeRoomServices TypeRoomervice)
        {
            this._TypeRoomService = TypeRoomervice;
        }
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [Authorize(Roles = "SupperAdmin")]
        public JsonResult Delete(int id)
        {
            var target = _TypeRoomService.Delete(id);
            _TypeRoomService.Save();
            return Json(new
            {
                message = ResultState.Delete_SUCCESS
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [CustomAuthorize(Roles = "SupperAdmin")]
        public JsonResult DeleteMul(int[] ids)
        {
            var count = ids.Count();
            foreach (var id in ids)
            {
                _TypeRoomService.Delete(id);
            }
            _TypeRoomService.Save();
            return Json(new
            {
                message = ResultState.Delete_SUCCESS + count + " bản ghi"
            }, JsonRequestBehavior.AllowGet);
        }
      
        // GET: Admin/GetAll
        [HttpGet]
        public JsonResult GetAll()
        {
            var TypeRoomModel = _TypeRoomService.GetAll();

            var TypeRoom = Mapper.Map<IEnumerable<TypeRoom>, IEnumerable<TypeRoomViewModel>>(TypeRoomModel);

            return Json(new
            {
                data = TypeRoom,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }
       

        [HttpGet]
        public ActionResult GetDetail(int id)
        {
            var model = _TypeRoomService.GetById(id);
            return Json(new
            {
                status = true,
                data = model
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult CheckExist(string name)
        {
            var result = true;
            var data = _TypeRoomService.GetByName(name);
            if (data != null)
                result = false;
            return Json(new
            {
                result = result
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult Post(string typeRoom)
        {
            var javascript = new JavaScriptSerializer();
            var data = javascript.Deserialize<TypeRoom>(typeRoom);
            _TypeRoomService.Add(data);
            _TypeRoomService.Save();
            return Json(new
            {
                message = ResultState.Add_SUCCESS,
                status = true,
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult Put(string typeRoom)
        {
            string message = string.Empty;
            var jsonObj = new JavaScriptSerializer();
            var model = jsonObj.Deserialize<TypeRoomViewModel>(typeRoom);
            var check = _TypeRoomService.GetById(model.MaLoaiPhong);
            if (check != null)
            {
                check.UpdateTypeRoom(model);
                _TypeRoomService.Update(check);
                _TypeRoomService.Save();
                message = ResultState.Update_SUCCESS;
            }
            return Json(new
            {
                message = message,
                status = true,
            }, JsonRequestBehavior.AllowGet);
        }
    }
}

