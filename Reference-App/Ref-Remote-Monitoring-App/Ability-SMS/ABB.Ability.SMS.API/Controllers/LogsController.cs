using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace ABB.Ability.SMS.API.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class LogsController : Controller
    {
        private readonly ILogger<LogsController> _logger;
        private readonly ILoggerFactory _factory;

        public LogsController(ILogger<LogsController> logger, ILoggerFactory factory)
        {
            _logger = logger;
            _factory = factory;
        }

        [HttpPost]
        [Route("add/{logCategory}/{logLevel}/{logEvent}")]
        public async Task<IActionResult> AddAsync(string logCategory, string logLevel, string logEvent)
        {
            string logMessage = null;

            try
            {
                using (StreamReader reader = new StreamReader(Request.Body, Encoding.UTF8))
                {
                    logMessage = await reader.ReadToEndAsync();

                    var logger = NLog.LogManager.GetLogger(logCategory);

                    var logLevelEnum = NLog.LogLevel.FromString(logLevel);

                    logger.Log(logLevelEnum, logMessage);

                    return Ok();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to log message from external system: {logCategory}/{logLevel}/{logEvent} -> {logMessage}");
                return BadRequest();
            }
        }
    }
}