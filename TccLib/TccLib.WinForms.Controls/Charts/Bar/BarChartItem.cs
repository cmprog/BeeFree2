using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Drawing;

namespace TccLib.WinForms.Controls.Charts.Bar
{
    public class BarChartItem
    {
        public object Tag { get; set; }

        public float Value
        {
            get { return this.mValue; }
            set { this.SetAndInvalidate(ref this.mValue, value); }
        } private float mValue;

        public string Text
        {
            get { return this.mText; }
            set { this.SetAndInvalidate(ref this.mText, value); }
        } private string mText;

        public Color Color
        {
            get { return this.mColor; }
            set { this.SetAndInvalidate(ref this.mColor, value); }
        } private Color mColor;

        internal BarChart BarChart { get; set; }
        internal RectangleF Bounds { get; set; }

        internal BarChartItemState State { get; set; }
        internal bool Hidden { get; set; }
        internal float AnimationValue { get; set; }

        private void SetAndInvalidate<T>(ref T oldValue, T newValue)
        {
            if (object.Equals(oldValue, newValue)) return;
            oldValue = newValue;
            if (this.BarChart != null) this.BarChart.InvalidateBarChartItem(this);
        }
    }
}
