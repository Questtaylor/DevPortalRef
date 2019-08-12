using ABB.Ability.SMS.API.Settings;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ABB.Ability.SMS.API.Extensions {
    public static class ServiceCollectionExtensions {
        public static void AddUiConfigurationSettings(this IServiceCollection services, IConfiguration configuration) {
            var uiSection = configuration.GetSection("UiConfiguration");
            services.Configure<UiSettings>(uiSection);
        }       
    }
}
