using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace QuanLySinhVien.Webs.Authorize
{
    [AttributeUsage(AttributeTargets.All)]
    public class CustomAuthorizeAttribute:AuthorizeAttribute
    {
        public string ViewName { get; set; }
        public CustomAuthorizeAttribute()
        {
            ViewName = "AuthorizeFailse";
        }
        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            base.OnAuthorization(filterContext);
            IsUserAuthorized(filterContext);
        }
        private void IsUserAuthorized(AuthorizationContext filterContext)
        {
            if (filterContext.Result == null)
            {
                return;
            }
            if (filterContext.HttpContext.User.Identity.IsAuthenticated)
            {
                ViewDataDictionary dic = new ViewDataDictionary();
                dic.Add("message", "Bạn không được cấp quyền để thực hiện thao tác này!");
                var result =new ViewResult(){ ViewName=this.ViewName,ViewData=dic};
                filterContext.Result = result;
            }
        }
    }
}