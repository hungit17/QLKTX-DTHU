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
using QuanLySinhVien.Webs.Authorize;
using System;
using OfficeOpenXml;
using System.Drawing;
using System.Net.Mail;
using System.Configuration;
using System.Net;

namespace QuanLySinhVien.Webs.Controllers
{

    public class StudentsController : BaseController
    {
        private IStudentService _studentService;
        private IcontractService _contractService;

        private IroomService _roomService;
        public StudentsController(IStudentService studentService,
            IcontractService contractService,
            IroomService roomservice)
        {
            this._roomService = roomservice;
            this._studentService = studentService;
            this._contractService = contractService;
        }
        [CustomAuthorize(Roles ="Admin,SupperAdmin")]
        public ActionResult Index()
        {
            return View();
        }
  
        [CustomAuthorize(Roles ="Admin,SupperAdmin")]
        public void ExportExcel()
        {
            var model = _studentService.GetAll();
            var students= Mapper.Map<IEnumerable<Students>, IEnumerable<StudentsViewModel>>(model);
            ExcelPackage exp = new ExcelPackage();
            ExcelWorksheet ws = exp.Workbook.Worksheets.Add("quanlysinhvien");

            ws.Cells["A1"].Value = "ID";
            ws.Cells["B1"].Value = "Họ và tên";
            ws.Cells["C1"].Value = "Ngày sinh ";
            ws.Cells["D1"].Value = "Giới tính";
            ws.Cells["E1"].Value = "Số điện thoại";
            ws.Cells["F1"].Value = "Email";
            ws.Cells["G1"].Value = "Địa chỉ";
            var rowIndex = 2;

            foreach (var item in students)
            {
                var id = 0;
                ws.Row(rowIndex).Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.LightUp;
                ws.Row(rowIndex).Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml(string.Format("blue")));
                ws.Cells[string.Format($"A{rowIndex}")].Value = id;
                ws.Cells[string.Format($"B{rowIndex}")].Value = item.Name;
                ws.Cells[string.Format($"C{rowIndex}")].Value = item.BirthDay.ToString("dd/MM/yyyy");
                ws.Cells[string.Format($"D{rowIndex}")].Value = item.Gender == 1 ? "Nam" : "Nữ";
                ws.Cells[string.Format($"E{rowIndex}")].Value = item.PhoneNumber;
                ws.Cells[string.Format($"F{rowIndex}")].Value = item.Email;
                ws.Cells[string.Format($"G{rowIndex}")].Value = item.Address;
                rowIndex++;
                id++;
            }
            //ws.Cells["A:AZ"].AutoFitColumns();
            Response.Clear();
            Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            Response.AddHeader("content-disposition", "attachment:filename=" + "Quan-Ly-SV.xlsx");
            Response.BinaryWrite(exp.GetAsByteArray());
            Response.End();
        }

        [HttpGet]
        [CustomAuthorize(Roles = "Admin,SupperAdmin")]
        public JsonResult CheckExist(string name)
        {
            var result = true;
            var data = _studentService.GetByName(name);
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
            var target = _studentService.Delete(id);
            _studentService.Save();
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
                _studentService.Delete(id);
            }
            _studentService.Save();
            return Json(new
            {
                message = ResultState.Delete_SUCCESS + count + " bản ghi"
            }, JsonRequestBehavior.AllowGet);
        }
       

        // GET: Admin/GetAll
        [HttpGet]
        [CustomAuthorize(Roles = "Admin,SupperAdmin")]
        public JsonResult GetAll(string searchstr, int page, int pageSize = 5)
        {
            var studentmodel = _studentService.GetAll();

            if (!string.IsNullOrEmpty(searchstr))
            {
                studentmodel=   _studentService.GetAll(searchstr);
            }
       
            var students = Mapper.Map<IEnumerable<Students>, IEnumerable<StudentsViewModel>>(studentmodel);

            var dataModel = (from s in students
                       select new
                       {
                           s.ID,
                           s.Name,
                           s.Gender,
                           s.PhoneNumber,
                           s.ClassName,
                           s.Address,
                           s.Avatar,
                           s.BirthDay
                       }).ToList();

            var data = dataModel.
                Skip((page - 1) * pageSize).
                Take(pageSize);
            int totalRow = students.Count();

            return Json(new
            {
                data = data,
                total = totalRow,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult LoadStudentList()
        {
            var studentsModel = _studentService.GetAll().Where(x => x.RoomID == null);
            var studentsData = Mapper.Map<IEnumerable<Students>, IEnumerable<StudentsViewModel>>(studentsModel);

            return Json(new
            {
                status = true,
                data = studentsData
            }, JsonRequestBehavior.AllowGet);
        }
      
        [HttpGet]
        [CustomAuthorize(Roles = "Admin,SupperAdmin")]
        public ActionResult GetDetail(int id)
        {
            var studentmodel = _studentService.GetById(id);
            var roomModel = _roomService.GetByIdCondition(studentmodel.RoomID);
     
            var contractModel = _contractService.GetByIdCondition(studentmodel.Contracts_ID);
            ViewBag.Student = studentmodel;
            ViewBag.Room = roomModel;
            ViewBag.Contract = contractModel;
            return View();
        }
        //[HttpPost]
        //public JsonResult uploadContract()
        //{
        //    var contractUrl = string.Empty;

        //    bool isSavedSuccessfully = true;
        //    string fName = "";
        //    try
        //    {
        //        foreach (string fileName in Request.Files)
        //        {
        //            HttpPostedFileBase file = Request.Files[fileName];

        //            fName = file.FileName;
        //            if (file != null && file.ContentLength > 0)
        //            {

        //                var originalDirectory = new DirectoryInfo(string.Format("{0}Assets\\Upload\\", Server.MapPath(@"\")));

        //                string pathString = Path.Combine(originalDirectory.ToString(), "Contract");

        //                var fileName1 = Path.GetFileName(file.FileName);

        //                bool isExists = Directory.Exists(pathString);

        //                if (!isExists)
        //                    Directory.CreateDirectory(pathString);
        //                var path = string.Format("{0}\\{1}", pathString, file.FileName);
        //                file.SaveAs(path);
        //                contractUrl = String.Join(",", fileName1);

        //            }

        //        }
        //        Session.Add(CommonConstants.CONTRACTURL, contractUrl);

        //    }
        //    catch (Exception)
        //    {
        //        isSavedSuccessfully = false;
        //    }


        //    if (isSavedSuccessfully)
        //    {
        //        return Json(new { Message = fName });
        //    }
        //    else
        //    {
        //        return Json(new { Message = "Không thể upload vui lòng kiểm tra lại tập tin" });
        //    }
        //}
        private bool AddNewContract()
        {
            try
            {
                var contract = new Contract();
                contract.StudentID = (int)Session[CommonConstants.STUDENTID];
                contract.CreatedDate = DateTime.Now;
                DateTime date = DateTime.Now;
                contract.ExpireDate = date.AddYears(5);
                contract.Status = true;
                //contract.UrlContract = Session[CommonConstants.CONTRACTURL].ToString();
                _contractService.Add(contract);
                _contractService.Save();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
           
        }
        [HttpPost]
        [CustomAuthorize(Roles = "Admin,SupperAdmin")]
        public JsonResult Post(string student)
        {

            var studentID = getID();
            string message = string.Empty;
            var jsonObj = new JavaScriptSerializer();
            var model = jsonObj.Deserialize<Students>(student);
            Session.Add(CommonConstants.STUDENT, model);
            Session.Add(CommonConstants.STUDENTID, studentID);
             var result= AddNewContract();
       
                var contractID = _contractService.GetAll().LastOrDefault().ID;
                //gán contract id cho student
                model.Contracts_ID = contractID;
                _studentService.Add(model);
                _studentService.Save();
                var sendRs = SendMail(studentID);
                return Json(new
                {
                    message = "Đăng ký thành công đã gởi email xác nhận đến tài khoản đăng ký",
                    status = true,
                }, JsonRequestBehavior.AllowGet);
            
           
        }
        private int getID()
        {
            var identity = 0;
            try
            {
                identity = _studentService.GetAll().LastOrDefault().ID;
                identity++;
            }
            catch (Exception)
            {

            }
            return identity;

        }

        [HttpPost]
        [CustomAuthorize(Roles = "Admin,SupperAdmin")]
        public JsonResult Put(string student)
        {
            string message = string.Empty;
            var jsonObj = new JavaScriptSerializer();
            var model = jsonObj.Deserialize<StudentsViewModel>(student);

            var check = _studentService.GetById(model.ID);
            if (check != null)
            {
                check.UpdateStudent(model);
                _studentService.Update(check);
                _studentService.Save();
                message = ResultState.Update_SUCCESS;
            }
            return Json(new
            {
                message = message,
                status = true,
            }, JsonRequestBehavior.AllowGet);
        }
        private bool SendMail(int id)
        {
            var studentModel = _studentService.GetAll().Where(x => x.ID == id).ToList();
            if (studentModel != null)
            {
                var mailServer = ConfigurationManager.AppSettings["mailServer"];
                var mailPassword = ConfigurationManager.AppSettings["mailPassword"];
                // Plug in your email service here to send an email.
                var client = new SmtpClient
                {
                    Host = "smtp.gmail.com",
                    Port = 587,
                    UseDefaultCredentials = false,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    Credentials = new NetworkCredential(mailServer, mailPassword),
                    EnableSsl = true
                };
                foreach (var contract in studentModel)
                {
                    var from = new MailAddress(mailServer, "Quản lý ký túc xá trường Đại Học Đồng Tháp");
                    var to = new MailAddress(contract.Email);

                    var mail = new MailMessage(from, to)
                    {
                        Subject = "Thông báo đăng ký ở ký túc xá trường Đại Học Đồng Tháp",
                        Body = $"Xin chào: {contract.Name}" +
                        "\nĐơn xin ở nội trú tại ký túc xá trường đã được phê duyệt bạn vui lòng đến ký túc xá để hoàn thành các hợp đồng!" +
                        "\n Trân trọng",
                        IsBodyHtml = true
                    };
                    client.Send(mail);

                }

            }
            return false;


        }
        [HttpGet]
        public ActionResult _StudentChart()
        {
            return View();
        }
        public JsonResult Student_Chart()
        {
            var studentModel = _studentService.GetAll();
            var studentMapper = Mapper.Map<IEnumerable<Students>, IEnumerable<StudentsViewModel>>(studentModel);
            List<int> repartition = new List<int>();

            var gender = studentMapper.Select(x => x.Gender).Distinct();

            foreach (var item in gender)
            {
                repartition.Add(studentMapper.Count(x => x.Gender== item));
            }

            var studentData = repartition.ToList();

            return Json(new
            {
                repartition = studentData,
                Gender = gender
            }, JsonRequestBehavior.AllowGet);
        }
    }
}

