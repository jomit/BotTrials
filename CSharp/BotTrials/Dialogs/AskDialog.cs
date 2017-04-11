using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Builder.Luis;
using Microsoft.Bot.Builder.Luis.Models;
using System.Threading.Tasks;

namespace BotTrials.Dialogs
{
    [LuisModel("004f9554-8e5b-4283-b7e5-9c252ac98560", "450f65ff09ab485b91706148d7e15e9c")]
    [Serializable]
    public class AskDialog : LuisDialog<object>
    {
        [LuisIntent("")]
        public async Task None(IDialogContext context, LuisResult result)
        {
            string message = $"Sorry I did not understand: "
                + string.Join(", ", result.Intents.Select(i => i.Intent));
            await context.PostAsync(message);
            context.Wait(MessageReceived);
        }

        [LuisIntent("ProductSearch")]
        public async Task ProductSearch(IDialogContext context, LuisResult result)
        {
            //EntityRecommendation search;
            //if (result.TryFindEntity("Product::PartialProduct", out search))
            //{

            //}
            //else
            //{
            //    await context.PostAsync($"Here you what you are looking for {search}");
            //    context.Wait(MessageReceived);
            //}
            string message = $"Here is your intent : "
               + string.Join(", ", result.Intents.Select(i => i.Intent)) + " | "
               + string.Join(", ", result.Entities.Select(i => i.Entity));
            await context.PostAsync(message);
            context.Wait(MessageReceived);
        }
    }
}