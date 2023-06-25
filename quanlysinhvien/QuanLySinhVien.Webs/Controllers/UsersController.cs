using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using QuanLySinhVien.Common;
using QuanLySinhVien.Webs.Models.Identity;
using System.Threading.Tasks;
using QuanLySinhVien.Webs.Authorize;

namespace QuanLySinhVien.Webs.Controllers
{
    public class UsersController : BaseController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: Users
        [CustomAuthorize(Roles = "SupperAdmin")]
        public ActionResult Index()
        {
            return View();
        }
        [CustomAuthorize(Roles = "SupperAdmin")]
        public JsonResult GetAll(string searchstr, int page, int pageSize = 5)
        {
            var users = db.Users.ToList();
            if (!string.IsNullOrEmpty(searchstr))
            {
                users = users.Where(x => x.FullName.Contains(searchstr) || x.UserName.Contains(searchstr)).ToList();
            }
            var data = users.
               Skip((page - 1) * pageSize).
               Take(pageSize);
            int totalRow = users.Count();
            return Json(new{
                data=data,
                total=totalRow,
                status=true
            },JsonRequestBehavior.AllowGet);
        }
        [HttpPost]

        public JsonResult SaveData(string strUser)
        {
            var message = string.Empty;
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            var model= serializer.Deserialize<AspNetUser>(strUser);
            var user = db.Users.Find(model.Id);
            if(user==null)
            {
                return Json(new
                {
                    status = false,
                    message = ResultState.NOT_FOUND
                },JsonRequestBehavior.AllowGet);
            }
            else
            {
                user.Avatar = model.Avatar;
                user.Email = model.Email;
                user.FullName = model.FullName;
                user.Gender = model.Gender;
                if (model.BirthDay == null)
                    model.BirthDay = DateTime.Parse("1/1/1990");
                else
                    user.BirthDay = model.BirthDay;
                user.Address = model.Address;
                user.PhoneNumber = model.PhoneNumber;
                user.UserName = model.Email;
                db.SaveChanges();
                message = ResultState.Add_SUCCESS;
                return Json(new
                {
                    message=message,
                    status=true
                },JsonRequestBehavior.AllowGet);
            }
            
           
        }
  
       
        [HttpPost]
        public JsonResult LoadDetail(string id)
        {
            var message = string.Empty;
            var user = db.Users.Find(id);
            if (user == null)
            {
                message = ResultState.NOT_FOUND;
                return Json(new
                {
                    message = message,
                    status = false
                },JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new
                {
                    data=user,
                    status=true
                }, JsonRequestBehavior.AllowGet);
            }

        }
        [CustomAuthorize(Roles = "SupperAdmin")]
        public JsonResult RoleByUsers(string id)
        { 
            var manager = new ApplicationUserManager(new UserStore<ApplicationUser>(db));
            var data = manager.GetRoles(id);
            return Json(new
            {
                data = data,
                status = true
            },JsonRequestBehavior.AllowGet);

        }

        // GET: Users/Create


        // GET: Users/Delete/5
        [CustomAuthorize(Roles = "SupperAdmin")]
        public JsonResult Delete(string id)
        {
            if (id == null)
            {
                return Json(new
                {
                    status = false,
                    message = ResultState.Bad_Request
                },JsonRequestBehavior.AllowGet);
            }
            ApplicationUser applicationUser = db.Users.Find(id);
            var manager = new ApplicationUserManager(new UserStore<ApplicationUser>(db));
            var checkroles = manager.GetRoles(id);
            if (checkroles.Contains("SupperAdmin"))
            {
                return Json(new
                {
                    status = false,
                    message = ResultState.Delete_Deny
                }, JsonRequestBehavior.AllowGet);
            }
            db.Users.Remove(applicationUser);
            db.SaveChanges();
            if (applicationUser == null)
            {
                return Json(new
                {
                    status = false,
                    message = ResultState.NOT_FOUND
                },JsonRequestBehavior.AllowGet);
            }
            return Json(new {
                status=true,
                message=ResultState.Delete_SUCCESS
            },JsonRequestBehavior.AllowGet);
        }

  
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
