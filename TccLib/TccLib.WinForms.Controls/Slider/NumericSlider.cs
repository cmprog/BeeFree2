using System;
using System.Drawing;
using System.Windows.Forms;
using TccLib.Extensions;

namespace TccLib.WinForms.Controls.Slider
{
    public class NumericSlider : Control
    {
        public NumericSlider()
        {
            this.ResizeRedraw = true;
            this.DoubleBuffered = true;
        }

        public int Minimum
        {
            get { return this.mMinimum; }
            set { this.SetAndInvalidate(ref this.mMinimum, value); }
        } private int mMinimum;

        public int Value
        {
            get { return this.mValue; }
            set { if (this.SetAndInvalidate(ref this.mValue, value)) this.OnValueChanged(); }
        } private int mValue;

        public int Maximum
        {
            get { return this.mMaximum; }
            set { this.SetAndInvalidate(ref this.mMaximum, value); }
        } private int mMaximum;

        public event EventHandler ValueChanged;

        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);
        }

        protected void OnValueChanged()
        {
            this.OnValueChanged(EventArgs.Empty);
        }

        protected virtual void OnValueChanged(EventArgs e)
        {
            this.ValueChanged.Fire(this, e);
        }

        private bool SetAndInvalidate<T>(ref T oldValue, T newValue)
        {
            if (object.Equals(oldValue, newValue)) return false;
            oldValue = newValue;
            this.Invalidate();
            return true;
        }
    }
}
