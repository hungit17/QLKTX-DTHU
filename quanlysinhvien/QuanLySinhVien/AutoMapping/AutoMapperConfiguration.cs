using AutoMapper;
using QuanLySinhVien.Models;
using QuanLySinhVien.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QuanLySinhVien.Web.AutoMapping
{
    public class AutoMapperConfiguration
    {
      
         public static void Config()
        {
            Mapper.CreateMap<Students, StudentsViewModel>();
            Mapper.CreateMap<Users, StudentsViewModel>();
            Mapper.CreateMap<Students, StudentsViewModel>();
            Mapper.CreateMap<Students, StudentsViewModel>();

        }
    }
}