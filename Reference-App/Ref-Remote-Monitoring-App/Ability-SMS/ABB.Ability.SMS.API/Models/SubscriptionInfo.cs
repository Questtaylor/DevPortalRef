namespace ABB.Ability.SMS.API.Models
{
    public class SubscriptionInfo
    {
        public CreateSubscriptionResponse CreationResponse { get; set; }

        public string SubscriptionTopic { get; set; }
        public string DataAccessApiUrl { get; set; }
        public string OcpApimSubscriptionKey { get; set; }
        public string Token { get; set; }
    }
}
