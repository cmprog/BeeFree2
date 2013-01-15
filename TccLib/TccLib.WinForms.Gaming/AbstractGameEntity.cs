using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Drawing;
using System.Windows.Forms;
using TccLib.Extensions;

namespace TccLib.WinForms.Gaming
{
    public abstract class AbstractGameEntity : IGameEntity
    {
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

        public virtual void Render(Graphics graphics) { }

        public event EventHandler VisibleChanged;
        public event EventHandler RenderOrderChanged;
    }
}
