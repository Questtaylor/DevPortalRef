namespace ABB.Ability.SMS.API.Settings {
    public class UiSettings {
        public bool Verbose {get;set;}
        public bool ShowFakeDevices {get;set;}
        public string ReferenceUiApi {get;set;}
        public string AzureMapsKey {get;set;}
        public string ProvisionUrl {get;set;}
        public string TelemetryHubName {get;set;}
        public string ApiUrl {get;set;}
        public MsalSettings Msal {get;set;}
    }
}