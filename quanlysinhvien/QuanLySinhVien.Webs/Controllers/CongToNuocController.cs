using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using AutoMapper;
using Kendo.Mvc.Extensions;
using QuanLySinhVien.Common;
using QuanLySinhVien.Webs.Infrastructure.Extensions;
using QuanLySinhVien.Models.Models;
using QuanLySinhVien.Service;
using QuanLySinhVien.Webs.Models;
using System.Web.Helpers;
using Rotativa;
using QuanLySinhVien.Webs.Authorize;
using System;

namespace QuanLySinhVien.Webs.Controllers
{
    [Authorize]
    public class CongToNuocController : BaseController
    {
        private ICongToNuocService _congToNuocService;
        private IroomService _roomService;
        public CongToNuocController(ICongToNuocService congToNuocService,IroomService roomService)
        {
            this._roomService = roomService;
            this._congToNuocService = congToNuocService;
        }
        public ActionResult Index()
        {
            return View();
        }

        [CustomAuthorize(Roles = "Admin,SupperAdmin")]
        public void ExportExcel()
        {
            var model = _congToNuocService.GetAll();
            var roomModel = _roomService.GetAll();
            var dataModel = from ctn in model
                            join r in roomModel
                            on ctn.ID equals r.MaSoCongToDien
                            select new
                            {
                                ctn.ID,
                                ctn.MaSoCongTo,
                                r.RoomCode,
                                r.RoomName,
                                ctn.ChiSoCu,
                                ctn.ChiSoMoi,
                                ctn.TieuThu,
                                ctn.TongTien

                            };
            WebGrid grid = new WebGrid(source: dataModel, canPage: false, canSort: false);
            string gridData = grid.GetHtml(
            columns: grid.Columns(
                            grid.Column("ID", "ID"),
                            grid.Column("MaSoCongTo", "Ma so cong to"),
                            grid.Column("RoomCode", "Ma phong"),
                            grid.Column("RoomName", "Ten phong"),
                            grid.Column("ChiSoCu", "Chi so cu"),
                            grid.Column("ChiSoMoi", "Chi so moi"),
                             grid.Column("TieuThu", "Tieu thu"),
                            grid.Column("TongTien", "Tong tien")
                            )).ToString();
            Response.ClearContent();
            //give name to excel sheet.  
            Response.AddHeader("content-disposition", "attachment; filename=hoa-don.xls");
            //specify content type  
            Response.ContentType = "application/excel";
            //write excel data using this method   
            Response.Write(gridData);
            Response.End();
        }
   
       [HttpGet]
        public JsonResult loadCTN()
        {
            var ctnModel = _congToNuocService.GetAll().ToList();
            var roomModel = _roomService.GetAll();
        
            var data = (from ctn in ctnModel join 
                         room in roomModel on ctn.ID equals room.MaSoCongToNuoc
                        select ctn).ToList();
            var rs = ctnModel.Except(data);
            return Json(new
            {
                status=true,
                data = rs
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult loadAll()
        {
            var ctnModel = _congToNuocService.GetAll().ToList();
            var data = Mapper.Map<IEnumerable<CongToNuoc>, IEnumerable<CongToNuocViewModel>>(ctnModel);
            return Json(new
            {
                status=true,
                data = data
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [CustomAuthorize(Roles = "SupperAdmin")]
        public JsonResult Delete(int id)
        {
            var target = _congToNuocService.Delete(id);
            _congToNuocService.Save();
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
                _congToNuocService.Delete(id);
            }
            _congToNuocService.Save();
            return Json(new
            {
                message = ResultState.Delete_SUCCESS + count + " bản ghi"
            }, JsonRequestBehavior.AllowGet);
        }
    
        [HttpGet]
        [CustomAuthorize(Roles = "SupperAdmin,Admin")]
        public JsonResult GetAll(string searchstr, int page, int pageSize = 5)
        {
            var CongToNuocModel = _congToNuocService.GetAll();
            var roomModel = _roomService.GetAll();

            if (!string.IsNullOrEmpty(searchstr))
            {
                CongToNuocModel = _congToNuocService.GetAll(searchstr);
            }

            var CongToNuoc = Mapper.Map<IEnumerable<CongToNuoc>, IEnumerable<CongToNuocViewModel>>(CongToNuocModel);
         
            var data = CongToNuoc.
                Skip((page - 1) * pageSize).
                Take(pageSize);
            int totalRow = CongToNuoc.Count();

            return Json(new
            {
                data = data,
                total = totalRow,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [CustomAuthorize(Roles = "SupperAdmin,Admin")]
        public JsonResult Post(string CongToNuoc)
        {
            var info = System.Globalization.CultureInfo.GetCultureInfo("vi-VN");
            string message = string.Empty;
            var jsonObj = new JavaScriptSerializer();

            var model = jsonObj.Deserialize<CongToNuoc>(CongToNuoc);
            model.TieuThu = (int)Math.Floor(model.ChiSoMoi - model.ChiSoCu);
            var money = Operation.TinhTienNuoc((int)Math.Floor(model.TieuThu));
            model.TongTien =  money;

            _congToNuocService.Add(model);
            _congToNuocService.Save();
            message = ResultState.Add_SUCCESS;
            return Json(new
            {
                message = message,
                status = true,
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [CustomAuthorize(Roles = "SupperAdmin,Admin")]
        public JsonResult Put(string CongToNuoc)
        {
            var vi = System.Globalization.CultureInfo.GetCultureInfo("vi-VN");
            string message = string.Empty;
            var jsonObj = new JavaScriptSerializer();
            var model = jsonObj.Deserialize<CongToNuocViewModel>(CongToNuoc);

            var check = _congToNuocService.GetById(model.ID);
            if (check != null)
            {
                check.UpdateCongToNuoc(model);
                check.TieuThu = (int)Math.Floor(check.ChiSoMoi - check.ChiSoCu);
                var money = Operation.TinhTienDien((int)Math.Floor(check.TieuThu));
                check.TongTien =  money;
                _congToNuocService.Update(check);
                _congToNuocService.Save();
                message = ResultState.Update_SUCCESS;
            }
            return Json(new
            {
                message = message,
                status = true,
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult CheckExist(string id)
        {
            var result = true;
            var data = _congToNuocService.GetByName(id);
            if (data != null)
                result = false;
            return Json(new
            {
                result = result
            }, JsonRequestBehavior.AllowGet);
        }
    }
}

