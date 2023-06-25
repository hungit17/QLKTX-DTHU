using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using QuanLySinhVien.Common;
using QuanLySinhVien.Webs.Authorize;
using QuanLySinhVien.Webs.Models.Identity;
using System.Linq;
using System.Web.Mvc;

namespace QuanLySinhVien.Webs.Controllers
{
    [CustomAuthorize(Roles = "SupperAdmin")]
    public class RoleController : BaseController
    {
        private ApplicationDbContext dbContext = new ApplicationDbContext();
        [CustomAuthorize(Roles = "SupperAdmin")]
        public ActionResult Index()
        {
            return View(dbContext.Roles.ToList());
        }

        [HttpPost]
        [CustomAuthorize(Roles = "SupperAdmin")]
        public JsonResult Create(string Name)
        {
            var message = string.Empty;
            try
            {
                dbContext.Roles.Add(new IdentityRole()
                {
                    Name = Name
                });
                dbContext.SaveChanges();
                message = ResultState.Add_SUCCESS;
                return Json(new
                {
                    status = true,
                    message = message
                }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                message = ResultState.Add_FALSE;
                return Json(new
                {
                    status = false,
                    message = message
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        [CustomAuthorize(Roles = "SupperAdmin")]
        public JsonResult Delete(string id)
        {
            string message = string.Empty;
            try
            {
                var target = dbContext.Roles.Find(id);
                if (target.Name.Contains("SupperAdmin"))
                {
                    message = ResultState.Delete_Deny;
                    return Json(new
                    {
                        status = false,
                        message = message
                    }, JsonRequestBehavior.AllowGet);
                }
                dbContext.Roles.Remove(target);
                dbContext.SaveChanges();
                message = ResultState.Delete_SUCCESS;
                return Json(new
                {
                    status = true,
                    message = message
                }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                message = ResultState.Delete_FALSE;
                return Json(new
                {
                    status = false,
                    message = message
                }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        [CustomAuthorize(Roles = "SupperAdmin")]
        public JsonResult Edit(string id)
        {
            try
            {

                var role = dbContext.Roles.Find(id);

                return Json(new
                {
                    data = role,
                    status = true
                }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new
                {
                    status = false
                }, JsonRequestBehavior.AllowGet);
            }


        }
        [HttpPost]
        [CustomAuthorize(Roles = "SupperAdmin")]
        public JsonResult Save(string roleName, string id)
        {
            var message = string.Empty;
            try
            {
                var role = dbContext.Roles.Find(id);
                role.Name = roleName;
                dbContext.SaveChanges();
                message = ResultState.Update_SUCCESS;
                return Json(new
                {
                    message = message,
                    status = true
                }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                message = ResultState.Update_FALSE;
                return Json(new
                {
                    message = message,
                    status = false
                }, JsonRequestBehavior.AllowGet);
            }

        }
        [CustomAuthorize(Roles = "SupperAdmin")]
        public ActionResult ManagerUsers()
        {
            var list = dbContext.Roles.OrderBy(r => r.Name).ToList().Select(x =>
                new SelectListItem { Value = x.Name.ToString(), Text = x.Name }
            ).ToList();
            ViewBag.Roles = list;
            var users = dbContext.Users.OrderBy(r => r.Email).ToList().Select(x =>
                new SelectListItem { Value = x.Email.ToString(), Text = x.Email }
            ).ToList();
            ViewBag.UserName = users;
            return View();
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        [CustomAuthorize(Roles = "SupperAdmin")]
        public ActionResult RoleAddToUser(string UserName, string roleName)
        {
            if (ModelState.IsValid)
            {
                ApplicationUser user = dbContext.Users.Where(u => u.UserName.Equals(UserName, System.StringComparison.CurrentCultureIgnoreCase)).FirstOrDefault();
                var manager = new ApplicationUserManager(new UserStore<ApplicationUser>(dbContext));
                manager.AddToRole(user.Id, roleName);
                ViewBag.AddMessage = "Cấp quyền thành công!";
                

                var list = dbContext.Roles.OrderBy(x => x.Name).ToList().Select(rr => new SelectListItem
                {
                    Value = rr.Name,
                    Text = rr.Name
                }).ToList();
                var users = dbContext.Users.OrderBy(r => r.Email).ToList().Select(x =>
                    new SelectListItem { Value = x.Email.ToString(), Text = x.Email }
                ).ToList();
                ViewBag.Roles = list;

                ViewBag.UserName = users;
                return View("ManagerUsers");
            }
            else
                ModelState.AddModelError("", "Không được để trống các trường");
            return View("ManagerUsers");
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        [CustomAuthorize(Roles = "SupperAdmin")]
        public ActionResult GetRoles(string UserName)
        {
            if (ModelState.IsValid)
            {

                if (!string.IsNullOrWhiteSpace(UserName))
                {
                    ApplicationUser user = dbContext.Users.Where(u => u.UserName.Equals(UserName, System.StringComparison.CurrentCultureIgnoreCase)).FirstOrDefault();
                    var manager = new ApplicationUserManager(new UserStore<ApplicationUser>(dbContext));


                    ViewBag.RolesForThisUser = manager.GetRoles(user.Id);


                    //gán cho selectlist
                    var list = dbContext.Roles.OrderBy(x => x.Name).ToList().Select(rr => new SelectListItem
                    {
                        Value = rr.Name.ToString(),
                        Text = rr.Name
                    }).ToList();
                    var users = dbContext.Users.OrderBy(r => r.Email).ToList().Select(x =>
                   new SelectListItem { Value = x.Email.ToString(), Text = x.Email }
               ).ToList();
                    ViewBag.Roles = list;
                    ViewBag.UserName = users;
                }
                return View("ManagerUsers");
            }
            else
            {
               ModelState.AddModelError("", "Không được để trống các trường");

            }
            return View("ManagerUsers");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [CustomAuthorize(Roles = "SupperAdmin")]
        public ActionResult DeleteRoleForUser(string UserName, string RoleName)
        {
            if (ModelState.IsValid)
            {
                var manager = new ApplicationUserManager(new UserStore<ApplicationUser>(dbContext));
                ApplicationUser user = dbContext.Users.Where(u => u.UserName.Equals(UserName, System.StringComparison.CurrentCultureIgnoreCase)).FirstOrDefault();

                if (manager.IsInRole(user.Id, RoleName))
                {
                    manager.RemoveFromRole(user.Id, RoleName);
                    ViewBag.DeleteMessage = "Xóa quyền thành công";
                }
                else
                {
                    ViewBag.DeleteMessage = "Tài khoản không tồn tại quyền này";
                }


                //gán cho selectlist
                var list = dbContext.Roles.OrderBy(x => x.Name).ToList().Select(rr => new SelectListItem
                {
                    Value = rr.Name.ToString(),
                    Text = rr.Name
                }).ToList();
                ViewBag.Roles = list;
                var users = dbContext.Users.OrderBy(x => x.Email).ToList().Select(rr => new SelectListItem
                {
                    Value = rr.Email.ToString(),
                    Text = rr.Email
                }).ToList();
                ViewBag.UserName = users;

            }
            else
                ModelState.AddModelError("", "Không được để trống các trường");

            return View("ManagerUsers");
        }

    }
}