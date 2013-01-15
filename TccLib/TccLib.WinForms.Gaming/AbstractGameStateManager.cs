using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Drawing;
using System.Windows.Forms;

namespace TccLib.WinForms.Gaming
{
    public class AbstractGameStateManager : IGameStateManager
    {
        protected AbstractGameStateManager(Control hostingControl)
        {
            this.GameTime = new GameTime();
            
            this.GameTimer = new Timer { Interval = 33 };
            this.GameTimer.Tick += OnTimerTick;

            this.HostingControl = hostingControl;
            this.HostingControl.KeyUp += (s, e) => this.GameState.OnKeyUp(e);
            this.HostingControl.KeyDown += (s, e) => this.GameState.OnKeyDown(e);
            this.HostingControl.MouseMove += (s, e) => this.GameState.OnMouseMove(e);
            this.HostingControl.MouseClick += (s, e) => this.GameState.OnMouseClick(e);
        }

        protected Control HostingControl { get; private set; }
        protected Timer GameTimer { get; private set; }
        protected GameTime GameTime { get; private set; }

        public SizeF Size { get; set; }

        private IGameState mGameState;
        public IGameState GameState
        {
            get { return this.mGameState; }
            set
            {
                this.mGameState = value;
                this.mGameState.Manager = this;
                this.mGameState.Initialize();
            }
        }

        protected DateTime StartTime { get; set; }

        public virtual void Start()
        {
            this.StartTime = DateTime.Now;

            if (this.GameState == null)
            {
                throw new InvalidOperationException("Cannot start the game until an initial GameState has been set.");
            }

            this.GameTimer.Start();
        }

        protected virtual void OnTimerTick(object sender, EventArgs e)
        {
            this.GameState.Update(this.GameTime);
            this.GameState.Render(this.HostingControl.CreateGraphics());
        }

        public void Exit()
        {
            this.GameTimer.Stop();
        }
    }
}
