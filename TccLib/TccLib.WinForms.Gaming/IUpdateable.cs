using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace TccLib.WinForms.Gaming
{
    public interface IUpdateable
    {
        bool Enabled { get; set; }
        int UpdateOrder { get; set; }

        void Update(GameTime gameTime);

        event EventHandler EnabledChanged;
        event EventHandler UpdateOrderChanged;
    }
}
