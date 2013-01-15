using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Drawing;

namespace TccLib.WinForms.Gaming
{
    public interface IGameStateManager
    {
        IGameState GameState { get; set; }

        SizeF Size { get; set; }

        void Start();
        void Exit();
    }
}
