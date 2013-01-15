using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Drawing;
using System.Windows.Forms;
using TccLib.Extensions;

namespace TccLib.WinForms.Gaming
{
    public abstract class AbstractGameState : IGameState
    {
        private bool mEnabled;
        public bool Enabled
        {
            get { return this.mEnabled; }
            set
            {
                if (this.mEnabled == value) return;
                this.mEnabled = value;
                this.EnabledChanged.Fire(this);
            }
        }

        private int mUpdateOrder;
        public int UpdateOrder
        {
            get { return this.mUpdateOrder; }
            set
            {
                if (this.mUpdateOrder == value) return;
                this.mUpdateOrder = value;
                this.UpdateOrderChanged.Fire(this);
            }
        }

        public abstract void Update(GameTime gameTime);

        public event EventHandler EnabledChanged;
        public event EventHandler UpdateOrderChanged;

        private bool mVisible;
        public bool Visible
        {
            get { return this.mVisible; }
            set
            {
                if (this.mVisible == value) return;
                this.mVisible = value;
                this.VisibleChanged.Fire(this);
            }
        }

        private int mRenderOrder;
        public int RenderOrder
        {
            get { return this.mRenderOrder; }
            set
            {
                if (this.mRenderOrder == value) return;
                this.mRenderOrder = value;
                this.RenderOrderChanged.Fire(this);
            }
        }

        public bool NeedsRendering { get; set; }

        public abstract void Render(Graphics graphics);

        public event EventHandler VisibleChanged;
        public event EventHandler RenderOrderChanged;

        public virtual void Initialize() { }

        public IGameStateManager Manager { get; set; }

        public virtual void OnKeyUp(KeyEventArgs e) { }
        public virtual void OnKeyDown(KeyEventArgs e) { }
        public virtual void OnMouseMove(MouseEventArgs e) { }
        public virtual void OnMouseClick(MouseEventArgs e) { }
    }
}
