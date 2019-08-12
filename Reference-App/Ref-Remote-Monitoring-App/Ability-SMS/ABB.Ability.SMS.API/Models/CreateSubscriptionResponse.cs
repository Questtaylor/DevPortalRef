namespace ABB.Ability.SMS.API.Models
{
    public class CreateSubscriptionResponse
    {
        /*name of the created subscription*/
        public string SubscriptionId { get; set; }

        /*fully qualified url of the created subscription*/
        public string ConnectionUrl { get; set; }

        /*security token granting access to the created subscription for the requested sasTokenTTL time.*/
        public string SasToken { get; set; }
    }
}
