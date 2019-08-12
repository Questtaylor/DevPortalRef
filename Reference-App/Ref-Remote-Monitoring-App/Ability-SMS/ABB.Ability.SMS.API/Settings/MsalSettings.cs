namespace ABB.Ability.SMS.API.Settings {
    public class MsalSettings {
        public string Tenant {get;set;}
        public string ClientID {get;set;}
        public string PolicyPrefix {get;set;}
        public string PolicySuffix {get;set;}
        public string SolutionNamespace {get;set;}
        public string RedirectUri {get;set;}
    }
}