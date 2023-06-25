using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using QuanLySinhVien.Common;
using QuanLySinhVien.Webs.Models.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QuanLySinhVien.Webs.Controllers
{
    public class PartialController : BaseController
    {
        private ApplicationDbContext dbContext = new ApplicationDbContext();
        // GET: Partial

        [ChildActionOnly]
        public ActionResult TopBar()
        {
            ViewBag.StudentRole = false;
            var userSession = (ApplicationUser)Session[CommonConstants.USER_SESSION];
            ApplicationUser user = dbContext.Users.Where(u => u.UserName.Equals(userSession.Email, System.StringComparison.CurrentCultureIgnoreCase)).FirstOrDefault();
            var manager = new ApplicationUserManager(new UserStore<ApplicationUser>(dbContext));
            var roleForUser = manager.GetRoles(user.Id).ToList();
            foreach (var check in roleForUser)
            {
                if (check.Equals("Student"))
                {
                    ViewBag.StudentRole = true;
                }
            }


            return PartialView();
        }
    }
}