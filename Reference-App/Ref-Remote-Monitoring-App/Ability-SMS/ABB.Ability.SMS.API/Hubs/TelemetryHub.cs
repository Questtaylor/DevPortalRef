using ABB.Ability.SMS.API.Handlers;
using ABB.Ability.SMS.API.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace ABB.Ability.SMS.API.Hubs
{
    public class TelemetryHub : Hub
    {
        private static ConcurrentDictionary<string, UserHub> _users = new ConcurrentDictionary<string, UserHub>();

        private ILogger<TelemetryHub> _logger;
        private readonly IConnectionHandler _connectionHandler;
        private readonly IMessageHandler _messageProcessor;
        private readonly IHubContext<TelemetryHub> _context;
        private readonly IConnectionHandler _connectionService;

        public TelemetryHub(
            IServiceProvider serviceProvider,
            ILogger<TelemetryHub> logger,
            IConnectionHandler connectionHandler,
            IMessageHandler messageProcessor,
            IHubContext<TelemetryHub> telemetryHub
            )
        {
            _context = telemetryHub ?? throw new ArgumentNullException(nameof(telemetryHub));
            _connectionService = serviceProvider.GetService<IConnectionHandler>();
            _logger = logger;
            _connectionHandler = connectionHandler;
            _messageProcessor = messageProcessor ?? throw new ArgumentNullException(nameof(messageProcessor));
        }

        public async Task CloseSubscription(string json)
        {
            var request = JsonConvert.DeserializeAnonymousType(json, new { subscriptionId = string.Empty });
            var result = _users.TryRemove(Context.ConnectionId, out UserHub userHub);

            if (userHub != null)
            {
                if (request != null && !String.IsNullOrEmpty(request.subscriptionId))
                {
                    var subToRemove = userHub.UserHubSubscription.Find(x => x.SubscriptionId == request.subscriptionId);
                    await _connectionService.UnRegisterMessageProcessor(subToRemove.MessageProcessorId);
                    await RemoveSubscription(subToRemove);

                    _users.TryAdd(Context.ConnectionId, new UserHub
                    {
                        UserIdentifier = Context.UserIdentifier,
                        ConnectionId = Context.ConnectionId,
                        UserHubSubscription = userHub.UserHubSubscription.Where(x => x.SubscriptionId != request.subscriptionId).ToList()
                    });
                }
                else
                {
                    foreach (var userHubSubscription in userHub.UserHubSubscription)
                    {
                        await _connectionService.UnRegisterMessageProcessor(userHubSubscription.MessageProcessorId);
                    }

                    foreach (var userHubSubscription in userHub.UserHubSubscription)
                    {
                        await RemoveSubscription(userHubSubscription);
                    }

                    UserHub userHub1 = new UserHub
                    {
                        UserIdentifier = Context.UserIdentifier,
                        ConnectionId = Context.ConnectionId
                    };
                    _users.TryAdd(Context.ConnectionId, userHub1);
                }
            }

        }

        public Task CheckConnection(string json)
        {
            return Clients.Caller.SendAsync("opened");
        }

        public Task Open(string json)
        {
            _logger.LogTrace("Open called on TelemetryHub");
            var subscription = JsonConvert.DeserializeObject<SubscriptionInfo>(json);

            if (_users.ContainsKey(Context.ConnectionId))
            {
                var actualUser = _users[Context.ConnectionId];

                int maxConcurrentCalls = 5;

                _logger.LogInformation("Subscription request received: {0}", JsonConvert.SerializeObject(subscription));

                _messageProcessor.CreateServiceBusConnectionString(
                    subscription.CreationResponse.ConnectionUrl,
                    subscription.SubscriptionTopic,
                    subscription.CreationResponse.SasToken,
                    maxConcurrentCalls
                    );

                var subscriptionId = Guid.NewGuid().ToString();

                _messageProcessor.RegisterOnMessageHandlerAndReceiveMessages(_context, subscription.CreationResponse.SubscriptionId, Context.ConnectionId);

                _connectionHandler.RegisterMessageProcessor(subscriptionId, _messageProcessor);

                UserHubSubscription userHubSubscription = new UserHubSubscription
                {
                    SubscriptionId = subscription.CreationResponse.SubscriptionId,
                    SubscriptionType = subscription.SubscriptionTopic,
                    MessageProcessorId = subscriptionId,
                    DataAccessUrl = subscription.DataAccessApiUrl,
                    OcpApimSubscriptionKey = subscription.OcpApimSubscriptionKey,
                    Token = subscription.Token
                };

                actualUser.UserHubSubscription.Add(userHubSubscription);

                _users.AddOrUpdate(Context.ConnectionId, actualUser, (key, oldValue) =>
                {
                    return actualUser;
                });

            }
            var args = new object[] { subscription.CreationResponse.SubscriptionId };

            return Clients.Caller.SendCoreAsync("opened", args);
        }

        public override async Task OnConnectedAsync()
        {
            this._logger.LogInformation("User Connected", Context.ToString());
            var userHub = new UserHub
            {
                UserIdentifier = Context.UserIdentifier,
                ConnectionId = Context.ConnectionId
            };
            _users.TryAdd(Context.ConnectionId, userHub);

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var result = _users.TryRemove(Context.ConnectionId, out var userHub);

            if (userHub != null)
            {

                foreach (var userHubSubscription in userHub.UserHubSubscription)
                {
                    await _connectionService.UnRegisterMessageProcessor(userHubSubscription.MessageProcessorId);
                }

                foreach (var userHubSubscription in userHub.UserHubSubscription)
                {
                    await RemoveSubscription(userHubSubscription);
                }
            }
        }

        private async Task RemoveSubscription(UserHubSubscription userHubSubscription)
        {
            _logger.LogInformation("Remove from DA: {0}", userHubSubscription.DataAccessUrl);
            try
            {
                HttpClient httpClient = new HttpClient();

                string path = $"{userHubSubscription.DataAccessUrl}/Subscriptions?subscriptionId={userHubSubscription.SubscriptionId}&messageType={userHubSubscription.SubscriptionType}";

                httpClient.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", userHubSubscription.OcpApimSubscriptionKey);
                httpClient.DefaultRequestHeaders.Add("Authorization", "Bearer " + userHubSubscription.Token);

                HttpResponseMessage result = await httpClient.DeleteAsync(path);
                this._logger.LogDebug("Remove from DA result: {0}", JsonConvert.SerializeObject(result));
            }
            catch (Exception e)
            {
                this._logger.LogError("Cannot remove subscription", e);
            }

        }

    }
}
