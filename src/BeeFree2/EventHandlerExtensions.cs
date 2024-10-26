using System;

namespace BeeFree2
{
    public static class EventHandlerExtensions
    {


        public static void Fire(this EventHandler eventHandler, object instance)
        {
            eventHandler?.Invoke(instance, new EventArgs());
        }
    }
}
