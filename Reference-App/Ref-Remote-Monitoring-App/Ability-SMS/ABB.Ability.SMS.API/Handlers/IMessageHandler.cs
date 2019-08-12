using ABB.Ability.SMS.API.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Azure.ServiceBus;

namespace ABB.Ability.SMS.API.Handlers
{
    public interface IMessageHandler
    {
        ISubscriptionClient SubscriptionClient { get; }

        void RegisterOnMessageHandlerAndReceiveMessages(IHubContext<TelemetryHub> context, string subscriptionName, string connectionId);

        void CreateServiceBusConnectionString(string sbNamespace, string topicName, string sasToken, int maxConcurrentCalls);

        void StopSendData();
    }


}
