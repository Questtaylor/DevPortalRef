using System.Threading.Tasks;

namespace ABB.Ability.SMS.API.Handlers
{
    public interface IConnectionHandler
    {
        void RegisterMessageProcessor(string id, IMessageHandler messageProcessor);

        Task UnRegisterMessageProcessor(string id);
    }


}
