using ABB.Ability.SMS.API.Handlers;
using ABB.Ability.SMS.API.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Azure.ServiceBus;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ABB.Ability.SMS.API.Managers
{
    public class ServiceBusManager : IMessageHandler
    {
        private int _maxConcurrentCalls = 5;
        private ServiceBusConnectionStringBuilder _sbConnectionBuilder;
        private IHubContext<TelemetryHub> _hubConnection;

        public ISubscriptionClient SubscriptionClient { get; private set; }
        private readonly ILogger<ServiceBusManager> _iLogger;

        private string _connectionId;

        private bool _isStopped = false;

        public ServiceBusManager(ILogger<ServiceBusManager> iLogger)
        {
            _iLogger = iLogger;
        }



        public void RegisterOnMessageHandlerAndReceiveMessages(IHubContext<TelemetryHub> context, string subscriptionName, string connectionId)
        {
            _hubConnection = context;
            _connectionId = connectionId;

            SubscriptionClient = new SubscriptionClient(_sbConnectionBuilder, subscriptionName);

            // Configure the MessageHandler Options in terms of exception handling, number of concurrent messages to deliver etc.
            var messageHandlerOptions = new MessageHandlerOptions(ExceptionReceivedHandler)
            {
                // Maximum number of Concurrent calls to the callback `ProcessMessagesAsync`, set to 1 for simplicity.
                // Set it according to how many messages the application wants to process in parallel.
                MaxConcurrentCalls = _maxConcurrentCalls,

                // Indicates whether MessagePump should automatically complete the messages after returning from User Callback.
                // False below indicates the Complete will be handled by the User Callback as in `ProcessMessagesAsync` below.
                AutoComplete = false
            };

            _iLogger.LogTrace("TopicPath: {0}", SubscriptionClient.TopicPath);

            SubscriptionClient.RegisterMessageHandler(ProcessMessagesAsync, messageHandlerOptions);
        }

        public void CreateServiceBusConnectionString(string sbNamespace, string topicName, string sasToken, int maxConcurrentCalls)
        {

            if (string.IsNullOrEmpty(sbNamespace))
                throw new ArgumentNullException(nameof(sbNamespace));
            if (string.IsNullOrEmpty(topicName))
                throw new ArgumentNullException(nameof(topicName));
            if (string.IsNullOrEmpty(sasToken))
                throw new ArgumentNullException(nameof(sasToken));
            if (maxConcurrentCalls < 0)
                throw new ArgumentException("MaxConcurrentCalls parameter should not be less then 0", nameof(maxConcurrentCalls));

            //todo: GA: HACK - lack of consequence on API side
            var topicPath = topicName == "variables" ? "timeseries" : topicName.TrimEnd('s');
            var sbNamespaceFixed = sbNamespace.Replace(".servicebus.windows.net.servicebus.windows.net", ".servicebus.windows.net");

            _maxConcurrentCalls = maxConcurrentCalls;
            _sbConnectionBuilder = new ServiceBusConnectionStringBuilder(sbNamespaceFixed, topicPath, sasToken);
        }

        public void StopSendData()
        {
            _isStopped = true;
        }


        private async Task ProcessMessagesAsync(Message msg, CancellationToken token)
        {
            if (_isStopped)
                return;

            var keys = msg.UserProperties.Keys.ToList();

            try
            {
                var msgText = Encoding.UTF8.GetString(msg.Body);
                var d = JObject.Parse(msgText);
                this._iLogger.LogDebug("JObject.Parse: {0}", JsonConvert.SerializeObject(d));

                var userProperties = new JObject();
                keys.ForEach(key =>
                {
                    object dictionaryValue = msg.UserProperties[key];
                    if (dictionaryValue != null)
                    {
                        string value = dictionaryValue.ToString();
                        userProperties.Add(key, value);
                    }
                });
                this._iLogger.LogDebug("keys.ForEach: {0}", JsonConvert.SerializeObject(userProperties));

                d.Add("userProperties", userProperties);

                var serialized = JsonConvert.SerializeObject(d);

                this._iLogger.LogDebug("SerializeObject: {0}", serialized);

                await _hubConnection.Clients.Client(connectionId: _connectionId).SendAsync(SubscriptionClient.TopicPath, serialized);
                _iLogger.LogInformation(Encoding.UTF8.GetString(msg.Body));

                await SubscriptionClient.CompleteAsync(msg.SystemProperties.LockToken);
            }
            catch (Exception)
            {
                throw;
            }
        }


        private Task ExceptionReceivedHandler(ExceptionReceivedEventArgs exceptionReceivedEventArgs)
        {
            _iLogger.LogError($"Message handler encountered an exception {exceptionReceivedEventArgs.Exception}.",
                exceptionReceivedEventArgs.ExceptionReceivedContext);

            return Task.CompletedTask;
        }

    }
}
