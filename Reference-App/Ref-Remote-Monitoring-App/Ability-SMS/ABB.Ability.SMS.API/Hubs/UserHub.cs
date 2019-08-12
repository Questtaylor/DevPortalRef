using System.Collections.Generic;

namespace ABB.Ability.SMS.API.Hubs
{
    public class UserHub
    {
        
        public string UserIdentifier { get; set; }
        public string ConnectionId { get; set; }
        public List<UserHubSubscription> UserHubSubscription { get; set; }

        public UserHub()
        {
            UserHubSubscription=new List<UserHubSubscription>();
        }

    }

    public class UserHubSubscription
    {
        public string SubscriptionId { get; set; }
        public string SubscriptionType { get; set; }
        public string MessageProcessorId { get; set; }
        public string DataAccessUrl { get; set; }
        public string OcpApimSubscriptionKey { get; set; }
        public string Token { get; set; }
    }
}
