namespace QuanLySinhVien.Common
{
    public class CommonConstants
    {
        public static string CONTRACTURL = "ContractUrl";
        public static string STUDENT = "Student";
        public static string STUDENTID = "StudentId";
        public static string ImageUpload = "ImageUpload";
        public const string USER_SESSION = "USER_SESSION";
        public const string DefaultFooterId = "defaultFooter";
        public const float VAT = 0.1f;
        public const float VAT_Nuoc = 0.05f;
        public const float BaoVeMT = 0.1f;
    }
    public class MucGiaDien {
        //giá bán điện áp dụng từ ngày 01/12/2017
        //từ 0 đến 50 kWh
        public static double Muc_1 = 1549;
        //từ 51 đến 100 kWh
        public static double Muc_2 = 1600;
        //từ 51 đến 100 kWh              
        public static double Muc_3 = 1858;
        //từ 201 đến 300 kWh             
        public static double Muc_4 = 2340;
        //từ 301 đến 400 kWh             
        public static double Muc_5 = 2615;
        //từ 401 kWh trở lên             
        public static double Muc_6 = 2701;
    }
    public class MucGiaNuoc
    {
        //10m3 đầu tiên
        public static double Muc_1 = 5973;
        //10m3 đến 20m3
        public static double Muc_2 = 7052;
        //20m3 đến 30m3     
        public static double Muc_3 = 8669;
        //trên 30m3
        public static double Muc_4 = 15929;

    }
    public enum IDGroup
    {
        PRODUCT = 4,
        POST = 7
    }

}