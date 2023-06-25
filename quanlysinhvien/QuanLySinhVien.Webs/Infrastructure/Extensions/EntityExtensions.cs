using QuanLySinhVien.Models.Models;
using QuanLySinhVien.Webs.Models;
using System;

namespace QuanLySinhVien.Webs.Infrastructure.Extensions
{
    public static class EntityExtensions
    {
        public static void UpdateStudent(this Students student, StudentsViewModel studentVm)
        {
            student.ID = studentVm.ID;
            student.Name= student.Name;
            student.PhoneNumber = studentVm.PhoneNumber;
            student.Address= studentVm.Address;
            student.Avatar = studentVm.Avatar;
            student.BirthDay=studentVm.BirthDay;
            student.Email = studentVm.Email;
            student.ContentDescription = studentVm.ContentDescription;
            student.ClassName = studentVm.ClassName;
            student.RoomID = studentVm.RoomID;
            
        }
      
        public static void UpdateTypeRoom(this TypeRoom _typeRoom, TypeRoomViewModel _typeRoomVm)
        {
            _typeRoom.TenLoaiPhong = _typeRoomVm.TenLoaiPhong;

        }
        public static void UpdateBill(this Bill _bill, BillViewModel _billVm)
        {
            _bill.RoomID= _billVm.RoomID;

            _bill.CreatedDate = DateTime.Now;

        }
        public static void UpdateContract(this Contract _contract, ContractViewModel _contractVm)
        {
            _contract.StudentID = _contractVm.StudentID;
          
            _contract.UrlContract= _contractVm.UrlContract;
            _contract.Status= _contractVm.Status;
            _contract.ExpireDate = _contractVm.ExpireDate;
            _contract.CreatedDate = DateTime.Now;
        }
        public static void UpdatePosts(this Posts _posts, PostsViewModel _postVm)
        {
            _posts.Name = _postVm.Name;
            _posts.Avatar= _postVm.Avatar;
            _posts.Status= _postVm.Status;
            _posts.Content = _postVm.Content;

        }
        public static void UpdateCongToDien(this CongToDien _congtodien, CongToDienViewModel _congtodienVm)
        {
            _congtodien.MaSoCongTo = _congtodienVm.MaSoCongTo;
            _congtodien.ChiSoCu = _congtodienVm.ChiSoCu;
            _congtodien.ChiSoMoi = _congtodienVm.ChiSoMoi;
        }
        public static void UpdateCongToNuoc(this CongToNuoc _congtonuoc, CongToNuocViewModel _congtonuocVm)
        {
            _congtonuoc.MaSoCongTo = _congtonuocVm.MaSoCongTo;
            _congtonuoc.ChiSoCu =    _congtonuocVm.ChiSoCu;
            _congtonuoc.ChiSoMoi =   _congtonuocVm.ChiSoMoi;
        }
        public static void UpdateRoom(this Room _room, RoomViewModel _roomVm)
        {
            _room.RoomCode = _roomVm.RoomCode;
            _room.RoomName = _roomVm.RoomName;
            _room.TypeRoomID = _roomVm.TypeRoomID;
            _room.SoSV = _roomVm.SoSv;
            _room.GiaPhong= _roomVm.GiaPhong;
            _room.Description = _roomVm.Description;
            _room.MaSoCongToDien = _roomVm.MaSoCongToDien;
            _room.MaSoCongToNuoc = _roomVm.MaSoCongToNuoc;
            _room.Status = _roomVm.Status ;

        }
      
    }
}