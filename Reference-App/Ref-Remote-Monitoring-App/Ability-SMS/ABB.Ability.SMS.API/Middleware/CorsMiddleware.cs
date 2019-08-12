using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace ABB.Ability.SMS.API.Middleware
{
    public class CorsMiddleware
    {
        private readonly RequestDelegate _next;

        public CorsMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            string requiredOrgins = (string)httpContext.Request.Headers["Origin"];

            httpContext.Response.OnStarting(state => {
                var context = (HttpContext) state;
                string responseHeader = context.Response.Headers["Access-Control-Allow-Origin"];

                if (responseHeader != requiredOrgins)
                {
                    //if (context.Response.Headers.Keys.Contains("Access-Control-Allow-Origin")) {
                    //    context.Response.Headers["Access-Control-Allow-Origin"] = new[] { requiredOrgins };
                    //} else {
                    //    context.Response.Headers.Add("Access-Control-Allow-Origin", new[] { requiredOrgins });
                    //}
                }
                return Task.FromResult(0);
            }, httpContext);

            await _next(httpContext);
           
        }
    }

    // Extension method used to add the middleware to the HTTP request pipeline.
    public static class CorsMiddlewareExtensions
    {
        public static IApplicationBuilder UseCorsMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<CorsMiddleware>();
        }
    }
}
