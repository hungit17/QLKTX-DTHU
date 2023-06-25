namespace QuanLySinhVien.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Bill",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        RoomID = c.Int(nullable: false),
                        CreatedDate = c.DateTime(nullable: false),
                        TienDien = c.Decimal(precision: 18, scale: 2),
                        TienNuoc = c.Decimal(precision: 18, scale: 2),
                        TienPhong = c.Decimal(precision: 18, scale: 2),
                        TongTien = c.Decimal(precision: 18, scale: 2),
                        NgayThu = c.DateTime(nullable: false),
                        Status = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.Room", t => t.RoomID, cascadeDelete: true)
                .Index(t => t.RoomID);
            
            CreateTable(
                "dbo.Room",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        RoomCode = c.String(nullable: false),
                        MaSoCongToDien = c.Int(nullable: false),
                        SoSV = c.Int(),
                        GiaPhong = c.Decimal(precision: 18, scale: 2),
                        MaSoCongToNuoc = c.Int(nullable: false),
                        TypeRoomID = c.Int(nullable: false),
                        RoomName = c.String(nullable: false),
                        Description = c.String(),
                        Status = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.CongToDiens", t => t.MaSoCongToDien, cascadeDelete: true)
                .ForeignKey("dbo.CongToNuocs", t => t.MaSoCongToNuoc, cascadeDelete: true)
                .ForeignKey("dbo.TypeRoom", t => t.TypeRoomID, cascadeDelete: true)
                .Index(t => t.MaSoCongToDien)
                .Index(t => t.MaSoCongToNuoc)
                .Index(t => t.TypeRoomID);
            
            CreateTable(
                "dbo.CongToDiens",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        MaSoCongTo = c.String(),
                        ChiSoCu = c.Single(nullable: false),
                        ChiSoMoi = c.Single(nullable: false),
                        TieuThu = c.Single(nullable: false),
                        TongTien = c.Decimal(precision: 18, scale: 2),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.CongToNuocs",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        MaSoCongTo = c.String(),
                        ChiSoCu = c.Single(nullable: false),
                        ChiSoMoi = c.Single(nullable: false),
                        TieuThu = c.Single(nullable: false),
                        TongTien = c.Decimal(precision: 18, scale: 2),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.TypeRoom",
                c => new
                    {
                        MaLoaiPhong = c.Int(nullable: false, identity: true),
                        TenLoaiPhong = c.String(),
                    })
                .PrimaryKey(t => t.MaLoaiPhong);
            
            CreateTable(
                "dbo.Contract",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        StudentID = c.Int(nullable: false),
                        UrlContract = c.String(),
                        CreatedDate = c.DateTime(nullable: false),
                        ExpireDate = c.DateTime(nullable: false),
                        Status = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.Posts",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Avatar = c.String(),
                        CreatedDate = c.DateTime(),
                        Content = c.String(),
                        MetaTitle = c.String(),
                        Status = c.Boolean(nullable: false),
                        PostBy = c.String(),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.AspNetRoles",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.Name, unique: true, name: "RoleNameIndex");
            
            CreateTable(
                "dbo.AspNetUserRoles",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        RoleId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.UserId, t.RoleId })
                .ForeignKey("dbo.AspNetRoles", t => t.RoleId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.RoleId);
            
            CreateTable(
                "dbo.Students",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 256),
                        BirthDay = c.DateTime(),
                        Gender = c.Int(nullable: false),
                        Avatar = c.String(maxLength: 256),
                        CreateDate = c.DateTime(),
                        UpdatedDate = c.DateTime(),
                        Address = c.String(maxLength: 256),
                        ClassName = c.String(),
                        RoomID = c.Int(),
                        Contracts_ID = c.Int(nullable: false),
                        PhoneNumber = c.String(maxLength: 50),
                        Email = c.String(maxLength: 50),
                        ContentDescription = c.String(),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.Contract", t => t.Contracts_ID, cascadeDelete: true)
                .ForeignKey("dbo.Room", t => t.RoomID)
                .Index(t => t.RoomID)
                .Index(t => t.Contracts_ID);
            
            CreateTable(
                "dbo.AspNetUsers",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Email = c.String(maxLength: 256),
                        EmailConfirmed = c.Boolean(nullable: false),
                        PasswordHash = c.String(),
                        SecurityStamp = c.String(),
                        PhoneNumber = c.String(),
                        PhoneNumberConfirmed = c.Boolean(nullable: false),
                        TwoFactorEnabled = c.Boolean(nullable: false),
                        LockoutEndDateUtc = c.DateTime(),
                        LockoutEnabled = c.Boolean(nullable: false),
                        AccessFailedCount = c.Int(nullable: false),
                        UserName = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.UserName, unique: true, name: "UserNameIndex");
            
            CreateTable(
                "dbo.AspNetUserClaims",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(nullable: false, maxLength: 128),
                        ClaimType = c.String(),
                        ClaimValue = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserLogins",
                c => new
                    {
                        LoginProvider = c.String(nullable: false, maxLength: 128),
                        ProviderKey = c.String(nullable: false, maxLength: 128),
                        UserId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.LoginProvider, t.ProviderKey, t.UserId })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserClaims", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.Students", "RoomID", "dbo.Room");
            DropForeignKey("dbo.Students", "Contracts_ID", "dbo.Contract");
            DropForeignKey("dbo.AspNetUserRoles", "RoleId", "dbo.AspNetRoles");
            DropForeignKey("dbo.Bill", "RoomID", "dbo.Room");
            DropForeignKey("dbo.Room", "TypeRoomID", "dbo.TypeRoom");
            DropForeignKey("dbo.Room", "MaSoCongToNuoc", "dbo.CongToNuocs");
            DropForeignKey("dbo.Room", "MaSoCongToDien", "dbo.CongToDiens");
            DropIndex("dbo.AspNetUserLogins", new[] { "UserId" });
            DropIndex("dbo.AspNetUserClaims", new[] { "UserId" });
            DropIndex("dbo.AspNetUsers", "UserNameIndex");
            DropIndex("dbo.Students", new[] { "Contracts_ID" });
            DropIndex("dbo.Students", new[] { "RoomID" });
            DropIndex("dbo.AspNetUserRoles", new[] { "RoleId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "UserId" });
            DropIndex("dbo.AspNetRoles", "RoleNameIndex");
            DropIndex("dbo.Room", new[] { "TypeRoomID" });
            DropIndex("dbo.Room", new[] { "MaSoCongToNuoc" });
            DropIndex("dbo.Room", new[] { "MaSoCongToDien" });
            DropIndex("dbo.Bill", new[] { "RoomID" });
            DropTable("dbo.AspNetUserLogins");
            DropTable("dbo.AspNetUserClaims");
            DropTable("dbo.AspNetUsers");
            DropTable("dbo.Students");
            DropTable("dbo.AspNetUserRoles");
            DropTable("dbo.AspNetRoles");
            DropTable("dbo.Posts");
            DropTable("dbo.Contract");
            DropTable("dbo.TypeRoom");
            DropTable("dbo.CongToNuocs");
            DropTable("dbo.CongToDiens");
            DropTable("dbo.Room");
            DropTable("dbo.Bill");
        }
    }
}
