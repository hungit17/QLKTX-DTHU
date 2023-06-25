using Autofac;
using Autofac.Integration.Mvc;
using QuanLySinhVien.Data.Infrastructure;
using Microsoft.Owin;
using Owin;
using System.Reflection;
using System.Web.Mvc;
using QuanLySinhVien.Data;
using QuanLySinhVien.Data.Repositories;
using QuanLySinhVien.Service;

[assembly: OwinStartup(typeof(QuanLySinhVien.App_Start.Startup))]

namespace QuanLySinhVien.App_Start
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
  
            AutofacConfig(app);
        }
        private void AutofacConfig(IAppBuilder app)
        {
            var builder = new ContainerBuilder();
            builder.RegisterControllers(Assembly.GetExecutingAssembly());

            builder.RegisterType<UnitOfWork>().As<IUnitOfWork>().InstancePerRequest();
            builder.RegisterType<DbFactory>().As<IDbFactory>().InstancePerRequest();

            builder.RegisterType<QuanLySinhVienDbContext>().AsSelf().InstancePerRequest();
            builder.RegisterType<QuanLySinhVienDbContext>().AsSelf().InstancePerRequest();
            //repository
            builder.RegisterAssemblyTypes(typeof(StudentsRepository).Assembly)
                .Where(t => t.Name.EndsWith("Repository"))
                .AsImplementedInterfaces().InstancePerRequest();

            //service

            builder.RegisterAssemblyTypes(typeof(StudentServices).Assembly)
                .Where(t => t.Name.EndsWith("Services"))
                .AsImplementedInterfaces().InstancePerRequest();
            Autofac.IContainer container = builder.Build();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
        }
    }
}
