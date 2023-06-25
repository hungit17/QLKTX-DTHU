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
    [Authorize()]
    public class CongToDienController : BaseController
    {
        private ICongToDienService _congToDienService;
        private IroomService _roomService;
        public CongToDienController(ICongToDienService congToDienService,IroomService roomService)
        {
            this._roomService = roomService;
            this._congToDienService = congToDienService;
        }
        [CustomAuthorize(Roles ="Admin,SupperAdmin")]
        public ActionResult Index()
        {
            return View();
        }

        [CustomAuthorize(Roles = "Admin,SupperAdmin")]
        public void ExportExcel()
        {
            var congtodienModel = _congToDienService.GetAll();
            var roomModel = _roomService.GetAll();
           var dataModel = from ctd in congtodienModel
                            join r in roomModel
                            on ctd.ID equals r.MaSoCongToDien
                            select new
                            {
                                ctd.ID,
                                ctd.MaSoCongTo,
                                r.RoomCode,
                                r.RoomName,
                                ctd.ChiSoCu,
                                ctd.ChiSoMoi,
                                ctd.TieuThu,
                                ctd.TongTien

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
            Response.AddHeader("content-disposition", "attachment; filename=Danh-sach-cong-to-dien.xls");
            //specify content type  
            Response.ContentType = "application/excel";
            //write excel data using this method   
            Response.Write(gridData);
            Response.End();
        }
     
        [HttpPost]
        [CustomAuthorize(Roles = "SupperAdmin")]
        public JsonResult Delete(int id)
        {
            var target = _congToDienService.Delete(id);
            _congToDienService.Save();
            return Json(new
            {
                message = ResultState.Delete_SUCCESS
            }, JsonRequestBehavior.AllowGet);
        }

        [CustomAuthorize(Roles = "SupperAdmin")]
        [HttpPost]
        public JsonResult DeleteMul(int[] ids)
        {
            var count = ids.Count();
            foreach (var id in ids)
            {
                _congToDienService.Delete(id);
            }
            _congToDienService.Save();
            return Json(new
            {
                message = ResultState.Delete_SUCCESS + count + " bản ghi"
            }, JsonRequestBehavior.AllowGet);
        }
     
        // GET: Admin/GetAll
        [CustomAuthorize(Roles = "Admin,SupperAdmin")]
        [HttpGet]
        public JsonResult GetAll(string searchstr, int page, int pageSize = 5)
        {
            var CongToDienModel = _congToDienService.GetAll();
            var roomModel = _roomService.GetAll();

            if (!string.IsNullOrEmpty(searchstr))
            {
                CongToDienModel=   _congToDienService.GetAll(searchstr);
            }
       
            var CongToDien = Mapper.Map<IEnumerable<CongToDien>, IEnumerable<CongToDienViewModel>>(CongToDienModel);

            var data = CongToDien.
                Skip((page - 1) * pageSize).
                Take(pageSize);
            int totalRow = CongToDien.Count();

            return Json(new
            {
                data = data,
                total = totalRow,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]

        public ActionResult GetDetail(int id)
        {
            var model = _congToDienService.GetById(id);
            return Json(new
            {
                status = true,
                data = model
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult loadCTD()
        {
            var ctdModel = _congToDienService.GetAll().ToList();
            var roomModel = _roomService.GetAll();
            var data = (from ctd in ctdModel join
                        room in roomModel on ctd.ID 
                        equals room.MaSoCongToDien
                        select ctd).ToList();
            var rs = ctdModel.Except(data);
            return Json(new {
                status=true,
                data=rs
            },JsonRequestBehavior.AllowGet);
        }
        [HttpGet]

        public JsonResult loadAll()
        {
            var ctdModel = _congToDienService.GetAll().ToList();
            var data = Mapper.Map<IEnumerable<CongToDien>, IEnumerable<CongToDienViewModel>>(ctdModel);
            return Json(new {
                status=true,
                data=data
            },JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [CustomAuthorize(Roles = "Admin,SupperAdmin")]
        public JsonResult Post(string CongToDien)
        {
            string message = string.Empty;
            var jsonObj = new JavaScriptSerializer();
            var model = jsonObj.Deserialize<CongToDien>(CongToDien);
            model.TieuThu = (int)Math.Floor(model.ChiSoMoi - model.ChiSoCu);
            var money = Operation.TinhTienDien((int)Math.Floor(model.TieuThu));
            model.TongTien = money;
            _congToDienService.Add(model);
            _congToDienService.Save();
            message = ResultState.Add_SUCCESS;
            return Json(new
            {
                message = message,
                status = true,
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [CustomAuthorize(Roles = "Admin,SupperAdmin")]
        public JsonResult Put(string CongToDien)
        {
            var vi = System.Globalization.CultureInfo.GetCultureInfo("vi-VN");
            string message = string.Empty;
            var jsonObj = new JavaScriptSerializer();
            var model = jsonObj.Deserialize<CongToDienViewModel>(CongToDien);
            var check = _congToDienService.GetById(model.ID);
            if (check != null)
            {
                check.UpdateCongToDien(model);
                //cập nhật lại tiền điện
                check.TieuThu = (int)Math.Floor(check.ChiSoMoi - check.ChiSoCu);
                var money = Operation.TinhTienDien((int)Math.Floor(check.TieuThu));
                check.TongTien = money;
                _congToDienService.Update(check);
                _congToDienService.Save();
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
            var data = _congToDienService.GetByName(id);
            if (data != null)
                result = false;
            return Json(new
            {
                result = result
            }, JsonRequestBehavior.AllowGet);
        }
    }
}

