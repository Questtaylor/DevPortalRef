using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace ABB.Ability.SMS.API.Handlers
{
    public class ConnectionHandler : IConnectionHandler
    {
        private readonly ConcurrentDictionary<string, IMessageHandler> _bag;
        private readonly ILogger<ConnectionHandler> _logger;

        public ConnectionHandler(ILogger<ConnectionHandler> logger)
        {
            _bag = new ConcurrentDictionary<string, IMessageHandler>();
            _logger = logger;
        }

        public void RegisterMessageProcessor(string id, IMessageHandler messageProcessor)
        {
            _bag.TryAdd(id, messageProcessor);
            _logger.LogInformation("Added new working messageProcessors: " + _bag.Count);
        }

        public async Task UnRegisterMessageProcessor(string id)
        {
            var result = _bag.TryRemove(id, out var iMessageHandler);

            if (result)
            {
                try
                {
                    iMessageHandler.StopSendData();
                    await iMessageHandler.SubscriptionClient.CloseAsync();
                }
                catch (Exception e)
                {
                    throw new Exception("Cannot close task", e);
                }


            }
            _logger.LogInformation("Closed HANDLER");
            _logger.LogInformation("Working HANDLERS: " + this._bag.Count);
        }
    }
}
