using System;

namespace TccLib.WinForms.Gaming
{
    public interface IGameState : IUpdateable, IEventHandler, IRenderable
    {
        void Initialize();

        IGameStateManager Manager { get; set; }
    }
}
