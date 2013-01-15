using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Drawing;

namespace TccLib.WinForms.Gaming
{
    public interface IRenderable
    {
        bool Visible { get; set; }
        int RenderOrder { get; set; }
        bool NeedsRendering { get; set; }

        void Render(Graphics graphics);

        event EventHandler VisibleChanged;
        event EventHandler RenderOrderChanged;
    }
}
