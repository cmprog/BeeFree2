using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace TccLib.WinForms.Gaming
{
    public interface IEventHandler
    {
        void OnKeyUp(KeyEventArgs e);
        void OnKeyDown(KeyEventArgs e);
        void OnMouseMove(MouseEventArgs e);
        void OnMouseClick(MouseEventArgs e);
    }
}
