using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLySinhVien.Common
{
    public class Operation
    {
        #region tiendien
        private static double giatien=0;
        private static double thueVAT=0;
        private static double GiaMuc_1(int dntt_Muc1)
        {
             giatien =  dntt_Muc1*MucGiaDien.Muc_1;

            thueVAT = giatien * CommonConstants.VAT;
            return giatien + thueVAT;
        }
        private static double GiaMuc_2(int dntt_Muc2)
        {
            var gia_muc_1 = 52 * MucGiaDien.Muc_1;
            var gia_muc_2 = (dntt_Muc2- 52) * MucGiaDien.Muc_2;
            giatien = gia_muc_1 + gia_muc_2;
            thueVAT = giatien * CommonConstants.VAT;
            return giatien+thueVAT;
        }
        private static double GiaMuc_3(int dntt_Muc3)
        {
            var gia_muc_1 = 52 * MucGiaDien.Muc_1;
            var gia_muc_2 = 52 * MucGiaDien.Muc_2;
            var gia_muc_3 = (dntt_Muc3-52*2) * MucGiaDien.Muc_3;
            giatien = gia_muc_1 + gia_muc_2+gia_muc_3;
            thueVAT = giatien * CommonConstants.VAT;
            return giatien + thueVAT;
        }
        private static double GiaMuc_4(int dntt_Muc4)
        {
            var gia_muc_1 = 52 * MucGiaDien.Muc_1;
            var gia_muc_2 = 52 * MucGiaDien.Muc_2;
            var gia_muc_3 = 52 * MucGiaDien.Muc_3;
            var gia_muc_4 = (dntt_Muc4 - 52*3) * MucGiaDien.Muc_4;
            giatien = gia_muc_1 + gia_muc_2+gia_muc_3+gia_muc_4;
            thueVAT = giatien * CommonConstants.VAT;
            return giatien + thueVAT;
        }
        private static double GiaMuc_5(int dntt_Muc5)
        {
            var gia_muc_1 = 52 * MucGiaDien.Muc_1;
            var gia_muc_2 = 52 * MucGiaDien.Muc_2;
            var gia_muc_3 = 52 * MucGiaDien.Muc_3;
            var gia_muc_4 = 52 * MucGiaDien.Muc_4;
            var gia_muc_5 = (dntt_Muc5 - 52 * 4) * MucGiaDien.Muc_5;
            giatien = gia_muc_1 + gia_muc_2 + gia_muc_3 + gia_muc_4+gia_muc_5;
            thueVAT = giatien * CommonConstants.VAT;
            return giatien + thueVAT;
        }
        private static double GiaMuc_6(int dntt_Muc6)
        {
            var gia_muc_1 = 52 * MucGiaDien.Muc_1;
            var gia_muc_2 = 52 * MucGiaDien.Muc_2;
            var gia_muc_3 = 52 * MucGiaDien.Muc_3;
            var gia_muc_4 = 52 * MucGiaDien.Muc_4;
            var gia_muc_5 = 52 * MucGiaDien.Muc_5;
            var gia_muc_6 = (dntt_Muc6 - 52 * 5) * MucGiaDien.Muc_6;
            giatien = gia_muc_1 + gia_muc_2 + gia_muc_3 + gia_muc_4+gia_muc_5+gia_muc_6;
            //thuế VAT
            thueVAT = giatien * CommonConstants.VAT;
            return giatien + thueVAT;
        }
        #endregion
        #region tiennuoc
        private static double GiaNuocMuc_1(int muc_1)
        {
            //giá mức 1 + thuế mức 1
            var gia_muc_1 = muc_1 * MucGiaNuoc.Muc_1+ (muc_1 * MucGiaNuoc.Muc_1)*CommonConstants.VAT_Nuoc+ (muc_1 * MucGiaNuoc.Muc_1) * CommonConstants.BaoVeMT;
            giatien = gia_muc_1;
            return giatien;
        }
        private static double GiaNuocMuc_2(int muc_2)
        {
            //giá mức 1 + thuế mức 1
            var gia_muc_1 = 10 * MucGiaNuoc.Muc_1 + (10 * MucGiaNuoc.Muc_1) * CommonConstants.VAT_Nuoc + (10 * MucGiaNuoc.Muc_1) * CommonConstants.BaoVeMT;
            var gia_muc_2 = (muc_2- 10) * MucGiaNuoc.Muc_2 + ((muc_2 - 10) * MucGiaNuoc.Muc_2 * CommonConstants.VAT_Nuoc) + ((muc_2 - 10) * MucGiaNuoc.Muc_2) * CommonConstants.BaoVeMT;
            giatien = gia_muc_1 +gia_muc_2;
            return giatien;
        }
        private static double GiaNuocMuc_3(int muc_3)
        {
            //giá mức 1 + thuế mức 1
            var gia_muc_1 = 10 * MucGiaNuoc.Muc_1 + (10 * MucGiaNuoc.Muc_1) * CommonConstants.VAT_Nuoc + (10 * MucGiaNuoc.Muc_1) * CommonConstants.BaoVeMT;
            var gia_muc_2 = (10 * MucGiaNuoc.Muc_2) + (10 * MucGiaNuoc.Muc_2 * CommonConstants.VAT_Nuoc) + (10 * MucGiaNuoc.Muc_2 * CommonConstants.BaoVeMT);
            var gia_muc_3 = (muc_3- 10*2) * MucGiaNuoc.Muc_3 + 10 * (((muc_3 - 10 * 2) * MucGiaNuoc.Muc_3) * CommonConstants.VAT_Nuoc) + ((muc_3 - 10 * 2)*MucGiaNuoc.Muc_3  * CommonConstants.BaoVeMT);
            giatien = gia_muc_1 + gia_muc_2+gia_muc_3;
            return giatien;
        }
        private static double GiaNuocMuc_4(int muc_4)
        {
            //giá mức 1 + thuế mức 1
            var gia_muc_1 = 10 * MucGiaNuoc.Muc_1 + (10 * MucGiaNuoc.Muc_1) * CommonConstants.VAT_Nuoc + (10 * MucGiaNuoc.Muc_1) * CommonConstants.BaoVeMT;
            var gia_muc_2 = (10 * MucGiaNuoc.Muc_2) + (10 * MucGiaNuoc.Muc_2 * CommonConstants.VAT_Nuoc) + (10 * MucGiaNuoc.Muc_2 * CommonConstants.BaoVeMT);
            var gia_muc_3 = (10 * MucGiaNuoc.Muc_3) + (10 * MucGiaNuoc.Muc_3 * CommonConstants.VAT_Nuoc) + (10 * MucGiaNuoc.Muc_3 * CommonConstants.BaoVeMT);
            var gia_muc_4 = (muc_4 - 10 * 3) * MucGiaNuoc.Muc_4 + 10 * (((muc_4 - 10 * 3) * MucGiaNuoc.Muc_4) * CommonConstants.VAT_Nuoc) + ((muc_4 - 10 * 3) * MucGiaNuoc.Muc_4 * CommonConstants.BaoVeMT);
            giatien = gia_muc_1 + gia_muc_2+gia_muc_3+gia_muc_4;
            return giatien;
        }
        #endregion

        public static decimal TinhTienNuoc(int NTT)
        {
            decimal money = 0;

            if (NTT >= 0 && NTT <= 10)
            {
                money = (decimal)GiaNuocMuc_1(NTT);

            }
            else if (NTT > 10 & NTT <= 20)
            {
                money = (decimal)GiaNuocMuc_2(NTT);
            }
            else if (NTT > 20 & NTT <= 30)
            {
                money = (decimal)GiaNuocMuc_3(NTT);
            }
            else if (NTT > 30)
            {
                money = (decimal)GiaNuocMuc_4(NTT);
            }
            return money;
        }
        public static decimal TinhTienDien(int DNTT)
        {
            decimal money = 0;

            if (DNTT >= 0 && DNTT <= 50)
            {
                money= (decimal)GiaMuc_1(DNTT);

            } else if(DNTT >= 51 & DNTT <= 100)
            {
                money = (decimal)GiaMuc_2(DNTT);
            }
            else if (DNTT >= 101 & DNTT <= 200)
            {
                money = (decimal)GiaMuc_3(DNTT);
            }
            else if (DNTT >= 201 & DNTT <= 300)
            {
                money = (decimal)GiaMuc_4(DNTT);
            }
            else if (DNTT >= 301 & DNTT <= 400)
            {
                money = (decimal)GiaMuc_5(DNTT);
            }
            else if(DNTT >= 401)
            {
                money = (decimal)GiaMuc_6(DNTT);
            }
            return money;
        }
    }
}
