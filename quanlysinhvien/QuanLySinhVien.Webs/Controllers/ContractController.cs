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
using Rotativa;
using System.IO;
using System.Web;
using System;
using System.Configuration;
using System.Net.Mail;
using System.Net;
using OfficeOpenXml;
using System.Drawing;
using QuanLySinhVien.Webs.Authorize;

namespace QuanLySinhVien.Webs.Controllers
{
    public class ContractController : BaseController
    {
        private IcontractService _ContractService;
        private IStudentService _studentService;
        private IroomService _roomService;
        public ContractController(IcontractService ContractService, IStudentService studentService, IroomService roomService)
        {
            this._roomService = roomService;
            this._ContractService = ContractService;
            this._studentService = studentService;
        }
        [CustomAuthorize(Roles = "SupperAdmin,Admin,Student")]
        public ActionResult Index()
        {
            return View();
        }
        [CustomAuthorize(Roles = "SupperAdmin,Admin,Student")]
        public ActionResult LoadFormContract()
        {
            return View();
        }
        [CustomAuthorize(Roles = "SupperAdmin")]
        public void ExportExcel()
        {
            
            var contractModel = _ContractService.GetAll();
            var studentModel = _studentService.GetAll();
            var data = (from c in contractModel
                        join
                         s in studentModel on c.ID equals s.Contracts_ID
                        select new
                        {
                            s.Name,
                            s.ClassName,
                            s.PhoneNumber,
                            c.CreatedDate,
                            c.ExpireDate,
                            c.Status
                        }).ToList();

            ExcelPackage exp = new ExcelPackage();
            ExcelWorksheet ws = exp.Workbook.Worksheets.Add("hop-dong-sinh-vien");

            ws.Cells["A1"].Value = "Tên sinh viên";
            ws.Cells["B1"].Value = "Trạng thái";
            ws.Cells["C1"].Value = "Số điện thoại";
            ws.Cells["D1"].Value = "Ngày đăng ký";
            ws.Cells["E1"].Value = "Ngày hết hạn";
            //write excel data using this method   
            var rowIndex = 2;
            foreach(var item in data)
            {
                ws.Row(rowIndex).Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.LightUp;
                ws.Row(rowIndex).Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml(string.Format("blue")));
                ws.Cells[string.Format($"A{rowIndex}")].Value = item.Name;
                ws.Cells[string.Format($"B{rowIndex}")].Value = item.Status==true?"Còn hiệu lực":"Hết hiệu lực";
                ws.Cells[string.Format($"C{rowIndex}")].Value = item.PhoneNumber;
                ws.Cells[string.Format($"D{rowIndex}")].Value = item.CreatedDate.ToString("dd/MM/yyyy");
                ws.Cells[string.Format($"E{rowIndex}")].Value = item.ExpireDate.ToString("dd/MM/yyyy");
                rowIndex++;
            }
            //ws.Cells["A:AZ"].AutoFitColumns();
            Response.Clear();
            Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            Response.AddHeader("content-disposition", "attachment:filename=" + "ExcelReport.xlsx");
            Response.BinaryWrite(exp.GetAsByteArray());
            Response.End();
        }



        [HttpPost]
        [CustomAuthorize(Roles = "SupperAdmin")]
        public JsonResult Delete(int id)
        {
            var target = _ContractService.Delete(id);
            _ContractService.Save();
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
                _ContractService.Delete(id);
            }
            _ContractService.Save();
            return Json(new
            {
                message = ResultState.Delete_SUCCESS + count + " bản ghi"
            }, JsonRequestBehavior.AllowGet);
        }
        

        // GET: Admin/GetAll
        [HttpGet]
        [CustomAuthorize(Roles = "SupperAdmin,Admin,Student")]
        public JsonResult GetAll(string searchstr, int page, int pageSize = 5)
        {
            var contractModel = _ContractService.GetAll();
            var studentModel = _studentService.GetAll();

            var Contract = Mapper.Map<IEnumerable<Contract>, IEnumerable<ContractViewModel>>(contractModel);
            var Student = Mapper.Map<IEnumerable<Students>, IEnumerable<StudentsViewModel>>(studentModel);

            var model = (from c in Contract
                         join s in Student on c.ID equals s.Contracts_ID
                         select new
                         {
                             c.ID,
                             c.UrlContract,
                             c.CreatedDate,
                             s.Name,
                             s.Email,
                             s.PhoneNumber,
                             s.Gender,
                             c.Status
                         }).ToList();

            var data = model.
                Skip((page - 1) * pageSize).
                Take(pageSize);
            int totalRow = Contract.Count();

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
            var model = _ContractService.GetById(id);
            return Json(new
            {
                status = true,
                data = model
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult uploadContract()
        {
            var contractUrl = string.Empty;

            bool isSavedSuccessfully = true;
            string fName = "";
            try
            {
                foreach (string fileName in Request.Files)
                {
                    HttpPostedFileBase file = Request.Files[fileName];

                    fName = file.FileName;
                    if (file != null && file.ContentLength > 0)
                    {

                        var originalDirectory = new DirectoryInfo(string.Format("{0}Assets\\Upload\\", Server.MapPath(@"\")));

                        string pathString = Path.Combine(originalDirectory.ToString(), "Contract");

                        var fileName1 = Path.GetFileName(file.FileName);

                        bool isExists = Directory.Exists(pathString);

                        if (!isExists)
                            Directory.CreateDirectory(pathString);
                        var path = string.Format("{0}\\{1}", pathString, file.FileName);
                        file.SaveAs(path);
                        contractUrl = String.Join(",", fileName1);

                    }

                }
                Session.Add(CommonConstants.CONTRACTURL, contractUrl);

            }
            catch (Exception)
            {
                isSavedSuccessfully = false;
            }


            if (isSavedSuccessfully)
            {
                return Json(new { Message = fName });
            }
            else
            {
                return Json(new { Message = "Không thể upload vui lòng kiểm tra lại tập tin" });
            }
        }
        private int getID()
        {
            var identity = 0;
            try
            {
                if (_studentService.GetAll().LastOrDefault() != null)
                {
                    identity = _studentService.GetAll().LastOrDefault().ID;
                    identity++;
                }
                
            }
            catch (Exception)
            {

            }
            return identity;

        }
        [HttpPost]
        [CustomAuthorize(Roles = "SupperAdmin,Admin,Student")]
        public JsonResult PostStudent(string student)
        {
            string message = string.Empty;
            var jsonObj = new JavaScriptSerializer();
            var model = jsonObj.Deserialize<Students>(student);
            Session.Add(CommonConstants.STUDENT, model);
            Session.Add(CommonConstants.STUDENTID, getID());
            message = ResultState.Add_SUCCESS;
            return Json(new
            {
                message = message,
                status = true,
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [CustomAuthorize(Roles = "SupperAdmin,Admin,Student")]
        public JsonResult Finish()
        {
            var message = string.Empty;
            DateTime basedate = new DateTime();
            var contract = new Contract();
            contract.CreatedDate = DateTime.Now;
            basedate = DateTime.Now;
            contract.ExpireDate = basedate.AddYears(5);
            contract.UrlContract = (string)Session[CommonConstants.CONTRACTURL];
            contract.StudentID = (int)Session[CommonConstants.STUDENTID];
            _ContractService.Add(contract);
            var studentModel = (Students)Session[CommonConstants.STUDENT];
            _ContractService.Save();
            var contractID = _ContractService.GetAll().LastOrDefault().ID;
            //gán contract id cho student
            studentModel.Contracts_ID = contractID;
            _studentService.Add(studentModel);
            _studentService.Save();
            message = ResultState.Add_SUCCESS;
            return Json(new
            {
                message = message,
                status = true,
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [CustomAuthorize(Roles = "SupperAdmin,Admin,Student")]
        public JsonResult Put(string contract)
        {
            string message = string.Empty;
            var jsonObj = new JavaScriptSerializer();
            var model = jsonObj.Deserialize<ContractViewModel>(contract);

            var check = _ContractService.GetById(model.ID);
            if (check != null)
            {
                check.UpdateContract(model);
                _ContractService.Update(check);
                _ContractService.Save();
                message = ResultState.Update_SUCCESS;
            }
            return Json(new
            {
                message = message,
                status = true,
            }, JsonRequestBehavior.AllowGet);
        }

        //phê duyệt hồ sơ
        [HttpPost]
        [CustomAuthorize(Roles = "SupperAdmin,Admin")]
        public JsonResult ApprovedContract(int id)
        {
            var status = false;
            var message = string.Empty;
            var contract = _ContractService.GetById(id);
            if (contract != null)
            {
                contract.Status = true;
                var sendRs = SendMail(id);
                _ContractService.Save();
                status = sendRs;
                message = "Phê duyệt thành công! Đã gởi mail đến tài khoản được đăng ký";
            }
            return Json(new
            {
                status = status,
                message = message
            }, JsonRequestBehavior.AllowGet);
        }
        private bool SendMail(int id)
        {
            var studentModel = _studentService.GetAll().Where(x => x.Contracts_ID == id).ToList();
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
    }
}

