using System;
using System.Collections.Generic;
using ABB.Ability.SMS.API.Extensions;
using ABB.Ability.SMS.API.Handlers;
using ABB.Ability.SMS.API.Managers;
using ABB.Ability.SMS.API.Middleware;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ABB.Ability.SMS.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            services.AddCors(options =>
            {
                options.AddPolicy("AnyPolicy",
                    builder => builder.AllowAnyMethod().AllowAnyHeader().AllowAnyHeader().AllowAnyOrigin().AllowCredentials()
                );
            });

            //services.AddLogging();
            services.AddSignalR();
            services.AddUiConfigurationSettings(Configuration);
            services.AddScoped<IMessageHandler, ServiceBusManager>();
            services.AddSingleton<IConnectionHandler, ConnectionHandler>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseCorsMiddleware();
            app.UseCors("AnyPolicy");

            app.UseSignalR(routes =>
            {
                routes.MapHub<Hubs.TelemetryHub>("/teleHub");                
            });

      // app.UseHttpsRedirection();

            DefaultFilesOptions options = new DefaultFilesOptions();
            options.DefaultFileNames.Clear();
            options.DefaultFileNames.Add("index.html");
            app.UseDefaultFiles(options);
            app.UseStaticFiles();

            app.UseMvc(routes => {
                routes.MapRoute("default", "{controller}/{action}");
            });
        }
    }
}
