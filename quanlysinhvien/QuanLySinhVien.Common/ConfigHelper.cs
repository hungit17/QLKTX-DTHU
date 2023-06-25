using System.Configuration;

namespace QuanLySinhVien.Common
{
    public class ConfigHelper
    {
        public static string productItem(string key)
        {
            return ConfigurationManager.AppSettings[key];
        }
        public static string postItem(string key)
        {
            return ConfigurationManager.AppSettings[key];
        }
        public static int getByKey(string key)
        {
            return int.Parse(ConfigurationManager.AppSettings[key]);
        }
    }
}
