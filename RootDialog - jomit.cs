using Autofac;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Builder.Dialogs.Internals;
using Microsoft.Bot.Builder.Luis;
using Microsoft.Bot.Builder.Luis.Models;
using Microsoft.Bot.Connector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Xml.Linq;
using System.Threading;
using Newtonsoft.Json;

namespace startNewDialog
{


    [Serializable]
    public class RootDialog : IDialog<object>
    {
        [NonSerialized]
        Timer t;
        
        public async Task StartAsync(IDialogContext context)
        {
            context.Wait(this.MessageReceivedAsync);
        }
        public virtual async Task MessageReceivedAsync(IDialogContext context, IAwaitable<IMessageActivity> result)
        {
            var message = await result;

            var resume = new ResumptionCookie(message).GZipSerialize();

            ConversationStarter.resumptionCookie = resume;

            //We will start a timer to fake a background service that will trigger the proactive message

            t = new Timer(new TimerCallback(timerEvent));
            t.Change(5000, Timeout.Infinite);

            var url = HttpContext.Current.Request.Url;
            await context.PostAsync("Hey there, I'm going to interrupt our conversation and start a survey in a few seconds. You can also make me send a message by accessing: " +
                    url.Scheme + "://" + url.Host + ":" + url.Port + "/api/CustomWebApi");
            context.Wait(MessageReceivedAsync);

            //// Updates by Jomit

            ////var resume = ResumptionCookie.GZipDeserialize("H4sIAAAAAAAEAI1SzU/CMBRnChPUgx4UPw5y0BvMwRiImSaC0RA/YgSMN1O2N6jrWtKuJv71+mo8gRpf0l+b93vffTkrl8t9oJjbyPoSwvMdDaVQIs6crsCjKYtAVitPIBUV/MxzThzXcauVnmaZlnDGQWeSsGrlQY8ZDW/gfSgSQMP6OPZO/BaJvFYTPL9g0jg/RncuKWFiopxHUDqdZZinJ0RCoYAuO8FFFElQ6jx5eemSMKF8ckWBRbvBSIG8JynMM4dBXw2lVhlEA5BvNISRZPNGO2h0LYWezRPl4FaEhC1EzWMD1tHfDXyXagZpWQZLywh2HiFvqsW36akAvDYaFAz3v4DGaTtAg340X9Ze0JsSzoEtUuWvCS3qD4Ke4G/4ocSMepHfD34fm2XEdGbbCBvMn3ZiAmknrsd+u0PtFdQWIdWMZELaRbNWEcQEl6WmsRi7hJpNlzcanYnr0eR1nBIeUnsV1VvTLJudHh/XG22zYk791Heb3ton9uR9p6gCAAA=");

            ////ConversationStarter.resumptionCookie = resume.GZipSerialize();
            ////await ConversationStarter.Resume();

            //var newmessage = ResumptionCookie.GZipDeserialize("H4sIAAAAAAAEAI1SzU/CMBRnChPUgx4UPw5y0BvMwRiImSaC0RA/YgSMN1O2N6jrWtKuJv71+mo8gRpf0l+b93vffTkrl8t9oJjbyPoSwvMdDaVQIs6crsCjKYtAVitPIBUV/MxzThzXcauVnmaZlnDGQWeSsGrlQY8ZDW/gfSgSQMP6OPZO/BaJvFYTPL9g0jg/RncuKWFiopxHUDqdZZinJ0RCoYAuO8FFFElQ6jx5eemSMKF8ckWBRbvBSIG8JynMM4dBXw2lVhlEA5BvNISRZPNGO2h0LYWezRPl4FaEhC1EzWMD1tHfDXyXagZpWQZLywh2HiFvqsW36akAvDYaFAz3v4DGaTtAg340X9Ze0JsSzoEtUuWvCS3qD4Ke4G/4ocSMepHfD34fm2XEdGbbCBvMn3ZiAmknrsd+u0PtFdQWIdWMZELaRbNWEcQEl6WmsRi7hJpNlzcanYnr0eR1nBIeUnsV1VvTLJudHh/XG22zYk791Heb3ton9uR9p6gCAAA=").GetMessage();
            //var client = new ConnectorClient(new Uri(newmessage.ServiceUrl));

            //var url = HttpContext.Current.Request.Url;
            //await context.PostAsync(newmessage);
            //context.Wait(MessageReceivedAsync);
        }
        public void timerEvent(object target)
        {
            
            t.Dispose();
            ConversationStarter.Resume(); //We don't need to wait for this, just want to start the interruption here
        }


    }
}