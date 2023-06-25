using AutoMapper;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using QuanLySinhVien.Common;
using QuanLySinhVien.Models.Models;
using QuanLySinhVien.Service;
using QuanLySinhVien.Webs.Authorize;
using QuanLySinhVien.Webs.Models;
using QuanLySinhVien.Webs.Models.Identity;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Mvc;

namespace QuanLySinhVien.Webs.Controllers
{
    
    public class HomeController : BaseController
    {
        private ApplicationDbContext dbContext = new ApplicationDbContext();
        private IPostsServices _postsServices;
        public HomeController(IPostsServices postsService)
        {
            this._postsServices = postsService;
        }

        // GET: Home

        public ActionResult Index()
        {
          
            return View();
        }
        [ChildActionOnly]
        public ActionResult ManagerCategory()
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
        [ChildActionOnly]
        public ActionResult GetPosts()
        {
            var posts = _postsServices.GetAll().Where(x=>x.Status==true).OrderByDescending(x=>x.CreatedDate);
            var data = Mapper.Map<IEnumerable<Posts>, IEnumerable<PostsViewModel>>(posts);
            return PartialView(data);
        }
        public ActionResult GetDetails(int id)
        {
            var post = _postsServices.GetById(id);
            if (post == null)
                return new HttpStatusCodeResult(HttpStatusCode.NotFound);

            return View(post);
        }
    }
}
