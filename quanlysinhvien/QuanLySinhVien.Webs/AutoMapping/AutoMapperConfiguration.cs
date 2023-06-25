using AutoMapper;
using QuanLySinhVien.Models.Models;
using QuanLySinhVien.Webs.Models;
using QuanLySinhVien.Webs.Models.Identity;

namespace QuanLySinhVien.Web.AutoMapping
{
    public class AutoMapperConfiguration
    {
         public static void Config()
        {
            Mapper.CreateMap<Students, StudentsViewModel>();
            Mapper.CreateMap<StudentsViewModel, Students>();
            Mapper.CreateMap<Bill, BillViewModel>(); 
            Mapper.CreateMap<Room, RoomViewModel>();
            Mapper.CreateMap<Contract, ContractViewModel>();
            Mapper.CreateMap<CongToDien, CongToDienViewModel>();
            Mapper.CreateMap<CongToNuoc, CongToNuocViewModel>();
            Mapper.CreateMap<Posts, PostsViewModel>();
            Mapper.CreateMap<TypeRoom, TypeRoomViewModel>();
        }
    }
}