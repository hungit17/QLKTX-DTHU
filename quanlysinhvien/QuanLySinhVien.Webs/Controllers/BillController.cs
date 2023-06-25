using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;
using AutoMapper;
using Kendo.Mvc.Extensions;
using QuanLySinhVien.Common;
using QuanLySinhVien.Models.Models;
using QuanLySinhVien.Service;
using QuanLySinhVien.Webs.Models;
using QuanLySinhVien.Webs.Authorize;
using System;
using OfficeOpenXml;
using System.Drawing;

namespace QuanLySinhVien.Webs.Controllers
{
    public class BillController : BaseController
    {
        private IBillService _billService;
        private IroomService _roomService;
        private ICongToDienService _congtodienService;
        private ICongToNuocService _congtonuocService;
        public BillController(IBillService billervice, IroomService roomService, ICongToDienService congToDienService, ICongToNuocService congToNuocService)
        {
            this._roomService = roomService;
            this._billService = billervice;
            this._congtodienService = congToDienService;
            this._congtonuocService = congToNuocService;
        }
        [CustomAuthorize(Roles = "Seller,Student,SupperAdmin")]
        public ActionResult Index()
        {
            return View();
        }
        [CustomAuthorize(Roles = "Seller,Student")]

        public ActionResult StudentNotifi()
        {
            return View();
        }
        [CustomAuthorize(Roles = "SupperAdmin,Seller")]
        public void ExportExcel()
        {
            var model = _billService.GetAll();
            var bill = Mapper.Map<IEnumerable<Bill>, IEnumerable<BillViewModel>>(model);
           
            ExcelPackage exp = new ExcelPackage();
            ExcelWorksheet ws = exp.Workbook.Worksheets.Add("QuanLyHoaDon");

            ws.Cells["A1"].Value = "ID";
            ws.Cells["B1"].Value = "Mã Phòng";
            ws.Cells["C1"].Value = "Ngày tạo";
            ws.Cells["D1"].Value = "Tiền điện";
            ws.Cells["E1"].Value = "Tiền Nước";
            ws.Cells["F1"].Value = "Tổng tiền";
            ws.Cells["G1"].Value = "Ngày thu";
            ws.Cells["H1"].Value = "Trạng thái";
            //write excel data using this method  
            var rowIndex = 2;
            foreach (var item in bill)
            {
                ws.Row(rowIndex).Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.LightUp;
                ws.Cells[string.Format($"A{rowIndex}")].Value = item.ID;
                ws.Cells[string.Format($"B{rowIndex}")].Value = item.RoomID;
                ws.Cells[string.Format($"C{rowIndex}")].Value = item.CreatedDate;
                ws.Cells[string.Format($"D{rowIndex}")].Value = item.TienDien;
                ws.Cells[string.Format($"E{rowIndex}")].Value = item.TienNuoc;
                ws.Cells[string.Format($"F{rowIndex}")].Value = item.TongTien;
                ws.Cells[string.Format($"G{rowIndex}")].Value = item.NgayThu;
                ws.Cells[string.Format($"H{rowIndex}")].Value = item.Status;
                rowIndex++;
            }
            //ws.Cells["A:AZ"].AutoFitColumns();
            Response.Clear();
            Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            Response.AddHeader("content-disposition", "attachment:filename=" + "QuanLyHoaDon.xlsx");
            Response.BinaryWrite(exp.GetAsByteArray());
            Response.End();
        }

        [HttpPost]
        [Authorize(Roles = "SupperAdmin")]
        public JsonResult Delete(int id)
        {
            var target = _billService.Delete(id);
            _billService.Save();
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
                _billService.Delete(id);
            }
            _billService.Save();
            return Json(new
            {
                message = ResultState.Delete_SUCCESS + count + " bản ghi"
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult loadRoomList()
        {
            var roomModel = _roomService.GetAll();
            var room = Mapper.Map<IEnumerable<Room>, IEnumerable<RoomViewModel>>(roomModel);
            return Json(new
            {
                status = true,
                data = room
            }, JsonRequestBehavior.AllowGet);

        }
        // GET: Admin/GetAll
        [HttpGet]
        [CustomAuthorize(Roles = "SupperAdmin,Seller,Student")]
        public JsonResult GetAll(string searchstr, DateTime? createdDate, DateTime? expiredDate, int page, int pageSize = 5)
        {
            var billModel = _billService.GetAll();
            var roomModel = _roomService.GetAll();

           

            var Bill = Mapper.Map<IEnumerable<Bill>, IEnumerable<BillViewModel>>(billModel);
            var room = Mapper.Map<IEnumerable<Room>, IEnumerable<RoomViewModel>>(roomModel);
 
            var dataModel = (from b in billModel
                             join r in roomModel on b.RoomID equals r.ID

                             select new
                             {
                                 b.ID,
                                 b.TienDien,
                                 b.TienNuoc,
                                 b.TongTien,
                                 b.CreatedDate,
                                 b.NgayThu,
                                 r.RoomName,
                                 b.Status
                             }).Skip((page - 1) * pageSize).OrderByDescending(x=>x.CreatedDate).Take(pageSize);
            if (!string.IsNullOrEmpty(searchstr))
            {
                dataModel = dataModel.Where(x=>x.RoomName.Contains(searchstr));
            }
            if (createdDate.HasValue)
            {
               dataModel= dataModel.Where(x => x.CreatedDate >= createdDate);
            }
            if (expiredDate.HasValue)
            {
                dataModel= dataModel.Where(x => x.NgayThu<= expiredDate);
            }
            var data = Bill.
                Skip((page - 1) * pageSize).
                Take(pageSize);
            int totalRow = Bill.Count();

            return Json(new
            {
                data = dataModel,
                total = totalRow,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        [CustomAuthorize(Roles = "Seller,Student,SupperAdmin")]
        public JsonResult ChuaThanhToan()
        {
            var billModel = _billService.GetAll();
            var roomModel = _roomService.GetAll();

            var Bill = Mapper.Map<IEnumerable<Bill>, IEnumerable<BillViewModel>>(billModel);
            var room = Mapper.Map<IEnumerable<Room>, IEnumerable<RoomViewModel>>(roomModel);

            var dataModel = (from b in billModel
                             join r in roomModel on b.RoomID equals r.ID
                             where b.Status==false
                             select new
                             {
                                 b.ID,
                                 b.TienDien,
                                 b.TienNuoc,
                                 b.TongTien,
                                 b.CreatedDate,
                                 r.RoomName,
                                 b.Status
                             }).ToList();

            return Json(new
            {
                data = dataModel,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }


        [HttpGet]
        public ActionResult GetDetail(int id)
        {
            var model = _billService.GetById(id);
            return Json(new
            {
                status = true,
                data = model
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [CustomAuthorize(Roles = "SupperAdmin,Seller")]
        public JsonResult Post(int roomID, DateTime CreatedDate, DateTime ExpiredDate)
        {

            var bill = new Bill();
            var roomModel = _roomService.GetById(roomID);
            var ctdModel = _congtodienService.GetById(roomModel.MaSoCongToDien);
            var ctnModel = _congtonuocService.GetById(roomModel.MaSoCongToNuoc);
            if (roomModel == null)
            {
                return Json(new
                {
                    message = ResultState.NOT_FOUND,
                    status = false,
                }, JsonRequestBehavior.AllowGet);
            }
            bill.CreatedDate = CreatedDate;
            bill.NgayThu = ExpiredDate;
            bill.RoomID = roomID;
            bill.TienDien = ctdModel.TongTien;
            bill.TienNuoc = ctnModel.TongTien;
            bill.TongTien = bill.TienDien + bill.TienNuoc;
            _billService.Add(bill);
            _billService.Save();
            return Json(new
            {
                message = ResultState.Add_SUCCESS,
                status = true,
            }, JsonRequestBehavior.AllowGet);
        }


        [CustomAuthorize(Roles = "SupperAdmin,Seller")]
        public ActionResult Payment(int id)
        {

            var billModel = _billService.GetById(id);
            if (billModel.Status == false)
            {
                billModel.Status = true;
                _billService.Save();
            }

            var roomModel = _roomService.GetById(billModel.RoomID);
            var congtodienModel = _congtodienService.GetById(roomModel.MaSoCongToDien);
            var congtonuocModel = _congtonuocService.GetById(roomModel.MaSoCongToNuoc);
            ViewBag.Room = roomModel;
            ViewBag.Bill = billModel;
            ViewBag.CongToDien = congtodienModel;
            ViewBag.CongToNuoc = congtonuocModel;
            return View();
        }
        [CustomAuthorize(Roles = "SupperAdmin,Seller")]
        public JsonResult SaveBillData()
        {
            var bill = _billService.GetAll().ToList();
            foreach(var _billitem in bill)
            {

            }
            return Json(new
            {

            },JsonRequestBehavior.AllowGet);
        }
    }
}

