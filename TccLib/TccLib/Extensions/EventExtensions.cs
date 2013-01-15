using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace TccLib.Extensions
{
    public static class EventExtensions
    {
        public static void Fire(this EventHandler @event, object sender)
        {
            @event.Fire(sender, EventArgs.Empty);
        }

        public static void Fire(this EventHandler @event, object sender, EventArgs e)
        {
            if (@event == null) return;
            @event(sender, e);
        }

        public static void Fire<TArgs>(this EventHandler<TArgs> @event, object sender, TArgs e) where TArgs : EventArgs
        {
            if (@event == null) return;
            @event(sender, e);
        }
    }
}
