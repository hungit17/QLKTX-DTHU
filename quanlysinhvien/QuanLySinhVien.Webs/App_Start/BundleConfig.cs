using System.Web;
using System.Web.Optimization;

namespace QuanLySinhVien.Webs
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/root/jquery").Include(
                        "~/Assets/template/plugins/jquery/jquery.min.js"));

            bundles.Add(new ScriptBundle("~/root/bootstrap").Include(
                            "~/Assets/template/plugins/bootstrap/js/bootstrap.js"));

            bundles.Add(new ScriptBundle("~/root/scripts").Include(       
                       "~/Assets/template/plugins/Chart.min.js",
                       "~/Assets/template/plugins/toastr/toastr.js",
                       "~/Assets/template/plugins/sweetalert/sweetalert.min.js",
                       "~/Assets/template/plugins/jquery-slimscroll/jquery.slimscroll.js",
                       "~/Assets/template/plugins/node-waves/waves.js",
                       "~/Assets/template/plugins/jquery.validate.min.js",
                       "~/Assets/template/plugins/bootbox.min.js",
                       "~/Assets/template/plugins/sweetalert/sweetalert.min.js",
                       "~/Assets/template/js/admin.js",
                       "~/Assets/template/plugins/moment.min.js",
                       "~/Assets/template/plugins/locale.js",
                       "~/Assets/template/plugins/mustache.min.js",
                       "~/Assets/template/plugins/select2.min.js",
                       "~/Assets/template/plugins/multi-select/js/jquery.multi-select.js",
                       "~/Assets/template/plugins/pagination.js",
                       "~/Assets/template/plugins/ckfinder/ckfinder.js",
                       "~/Assets/template/plugins/tinymce/tinymce.min.js",
                       "~/Assets/template/plugins/dropzone/dropzone.min.js",
                       "~/Assets/template/plugins/jquery.PrintArea.js",
                       "~/Assets/template/js/controllers/sharedController.js"

                       ));
           
            bundles.Add(new StyleBundle("~/root/css").Include(
                     "~/Assets/template/plugins/bootstrap/css/bootstrap.css",
                     "~/Assets/template/plugins/bootstrap-select/css/bootstrap-select.min.css",
                     "~/Assets/template/plugins/toastr/toastr.js",
                     "~/Assets/template/plugins/sweetalert/sweetalert.css",
                     "~/Assets/template/plugins/node-waves/waves.css",
                     "~/Assets/template/plugins/dropzone/basic.min.css",
                     "~/Assets/template/plugins/dropzone/dropzone.min.css",
                     "~/Assets/template/css/select2.min.css",
                     "~/Assets/template/plugins/multi-select/css/multi-select.css",
                     "~/Assets/template/plugins/animate-css/animate.css",
                     "~/Assets/template/css/style.css",
                     "~/Assets/template/css/themes/all-themes.css"
                     ));
        
            BundleTable.EnableOptimizations = false;
        }
            
    }
}
