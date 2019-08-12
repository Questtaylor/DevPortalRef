using ABB.Ability.SMS.API.Settings;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace ABB.Ability.SMS.API.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class ConfigurationController : Controller
    {
        private readonly ILogger<ConfigurationController> _logger;
        private readonly IOptions<UiSettings> _settings;

        public ConfigurationController(ILogger<ConfigurationController> logger, IOptions<UiSettings> settings)
        {
            _logger = logger;
            _settings = settings;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_settings.Value);
        }
    }
}