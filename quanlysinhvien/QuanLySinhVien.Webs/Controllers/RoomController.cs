using System;
using System.Collections.Generic;
using System.Data;
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
using OfficeOpenXml;
using System.Drawing;
using QuanLySinhVien.Webs.Authorize;
using QuanLySinhVien.Webs.Models.Identity;
using QuanLySinhVien.Data;

namespace QuanLySinhVien.Webs.Controllers
{
    public class RoomController : BaseController
    {
        private IroomService _roomService;
        private IStudentService _studentService;
        private ItypeRoomServices _typeRoomService;
        
        public RoomController(IroomService RoomService, IStudentService studentService,ItypeRoomServices typeroomService)
        {
            this._roomService = RoomService;
            this._studentService = studentService;
            this._typeRoomService = typeroomService;
        }
        public ActionResult Index()
        {
            return View();
        }

        [CustomAuthorize(Roles = "SupperAdmin,Admin")]
        public void ExportExcel()
        {
            var model = _roomService.GetAll();
            var Room = Mapper.Map<IEnumerable<Room>, IEnumerable<RoomViewModel>>(model);
        
            ExcelPackage exp = new ExcelPackage();
            ExcelWorksheet ws = exp.Workbook.Worksheets.Add("quanlyphong");

            ws.Cells["A1"].Value = "Mã phòng ";
            ws.Cells["B1"].Value = "Tên phòng";
            ws.Cells["C1"].Value = "Miêu tả phòng";
            ws.Cells["D1"].Value = "Trạng thái phòng";
            var rowIndex = 2;

            foreach (var item in Room)
            {
                ws.Row(rowIndex).Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.LightUp;
                ws.Row(rowIndex).Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml(string.Format("blue")));
                ws.Cells[string.Format($"A{rowIndex}")].Value = item.RoomCode;
                ws.Cells[string.Format($"B{rowIndex}")].Value = item.RoomName;
                ws.Cells[string.Format($"C{rowIndex}")].Value = item.Description;
                ws.Cells[string.Format($"D{rowIndex}")].Value = item.Status == true ? "Sẵn sàng" : "Không sẵn sàng";
                rowIndex++;
            }
            //ws.Cells["A:AZ"].AutoFitColumns();
            Response.Clear();
            Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            Response.AddHeader("content-disposition", "attachment:filename=" + "Quan-Ly-Phong-SV.xlsx");
            Response.BinaryWrite(exp.GetAsByteArray());
            Response.End();
        }

        [HttpGet]
        public JsonResult CheckExist(string name)
        {
            var result = true;
            var data = _roomService.GetByName(name);
            if (data != null)
                result = false;
            return Json(new
            {
                result = result
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [CustomAuthorize(Roles = "SupperAdmin")]
        public JsonResult Delete(int id)
        {
            var target = _roomService.Delete(id);
            _roomService.Save();
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
                _roomService.Delete(id);
            }
            _roomService.Save();
            return Json(new
            {
                message = ResultState.Delete_SUCCESS + count + " bản ghi"
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult LoadRoomList()
        {
            var roomModel = _roomService.GetAll();
            var typeRoomModel = _typeRoomService.GetAll();
            var roomsData = Mapper.Map<IEnumerable<Room>, IEnumerable<RoomViewModel>>(roomModel);
            var typeroomData = Mapper.Map<IEnumerable<TypeRoom>, IEnumerable<TypeRoomViewModel>>(typeRoomModel);
            var data = (from r in roomsData
                        join tr in typeroomData on r.TypeRoomID equals tr.MaLoaiPhong
                        select new
                        {
                            r.RoomName,
                            r.ID,
                            r.TypeRoomID,
                            r.Status,
                            tr.TenLoaiPhong,
                            tr.MaLoaiPhong
                        }).ToList();
            return Json(new
            {
                status = true,
                data = data
            }, JsonRequestBehavior.AllowGet);
        }
     
        [CustomAuthorize(Roles = "SupperAdmin,Admin")]
        public JsonResult AddStudentToRoom(int roomID,int[] listStudent)
        {
            
            var studentCount = listStudent.Count();
            var status = false;
            var message = string.Empty;
            try
            {

                for (int i = 0; i < studentCount; i++)
                {
                    var studentitem = _studentService.GetById(listStudent[i]);
                    studentitem.RoomID = roomID;
                }
                _studentService.Save();
                status = true;
                message = ResultState.Add_SUCCESS;
                
            }
            catch 
            {
                status = false;
                message = ResultState.Add_FALSE;
            }
            return Json(new
            {
                status=status,
                message=message
            },JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        [CustomAuthorize(Roles = "SupperAdmin,Admin")]
        public JsonResult GetAll(string searchstr, int page, int pageSize = 5)
        {
            List<int> studentCount = new List<int>();
            var roommodel = _roomService.GetAll();
            var studentmodel = _studentService.GetAll();
            if (!string.IsNullOrEmpty(searchstr))
            {
                roommodel = _roomService.GetAll(searchstr);
            }

            var Room = Mapper.Map<IEnumerable<Room>, IEnumerable<RoomViewModel>>(roommodel);
            var student = Mapper.Map<IEnumerable<Students>, IEnumerable<StudentsViewModel>>(studentmodel);

            var dataModel = (from r in Room
                            join s in student on r.ID 
                            equals s.RoomID
                            group new {r,s} by new {r.RoomName,r.RoomCode,r.Description,r.ID} into newgroup
                            select new
                            {
                                RoomCode=newgroup.Key.RoomCode,
                                RoomName=newgroup.Key.RoomName,
                                Description=newgroup.Key.Description,
                                ID=newgroup.Key.ID,
                                CountStudent=newgroup.Count()
                            }).ToList();

            var data = dataModel.
                Skip((page - 1) * pageSize).
                Take(pageSize);
            int totalRow = Room.Count();

            return Json(new
            {
                data = data,
                total = totalRow,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult _RoomChart()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetEmtyRoom(string searchstr)
        {
            List<int> studentCount = new List<int>();
            var roommodel = _roomService.GetAll();
            var studentmodel = _studentService.GetAll();
            if (!string.IsNullOrEmpty(searchstr))
            {
                roommodel = _roomService.GetAll(searchstr);
            }

            var Room = Mapper.Map<IEnumerable<Room>, IEnumerable<RoomViewModel>>(roommodel);
            var student = Mapper.Map<IEnumerable<Students>, IEnumerable<StudentsViewModel>>(studentmodel);

            var dataModel = (from r in Room
                             from s in student 
                             where r.ID!=s.RoomID
                             select r).Distinct().ToList();
            return Json(new
            {
                data = dataModel,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }


        [HttpGet]
        public JsonResult GetChart()
        {
            var roomModel = _roomService.GetAll();
            var roomMapper = Mapper.Map<IEnumerable<Room>, IEnumerable<RoomViewModel>>(roomModel);
            List<int> repartition = new List<int>();

            var roomStatus = roomMapper.Select(x => x.Status).Distinct();

            foreach (var item in roomStatus)
            {
                repartition.Add(roomMapper.Count(x => x.Status == item));
            }

            var roomData = repartition.ToList();

            return Json(new
            {
                repartition = roomData,
                roomStatus = roomStatus
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        [CustomAuthorize(Roles = "SupperAdmin,Admin")]
        public ActionResult GetDetail(int id)
        {
            var model = _studentService.GetAll().Where(x => x.RoomID == id).ToList();

            return Json(new
            {
                status = true,
                data = model
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [ValidateInput(false)]
        [CustomAuthorize(Roles = "SupperAdmin,Admin")]
        public JsonResult Post(string room)
        {
            string message = string.Empty;
            var jsonObj = new JavaScriptSerializer();
            var model = jsonObj.Deserialize<Room>(room);
            _roomService.Add(model);
            _roomService.Save();
            message = ResultState.Add_SUCCESS;
            return Json(new
            {
                message = message,
                status = true,
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [ValidateInput(false)]
        public JsonResult ThongKe(string typeChart)
        {
            
            return Json(new
            {
                status = true,
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [ValidateInput(false)]
        [CustomAuthorize(Roles = "SupperAdmin,Admin")]
        public JsonResult Put(string room)
        {
            string message = string.Empty;
            var jsonObj = new JavaScriptSerializer();
            var model = jsonObj.Deserialize<RoomViewModel>(room);

            var check = _roomService.GetById(model.ID);
            if (check != null)
            {
                check.UpdateRoom(model);
                _roomService.Update(check);
                _roomService.Save();
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

