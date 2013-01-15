using System;
using System.Drawing;
using System.Windows.Forms;
using System.Drawing.Drawing2D;
using System.Collections.Generic;

using TccLib.Drawing.Extensions;

namespace TccLib.WinForms.Controls.Charts.Bar
{
    public sealed class BarChart : Control
    {
        public BarChart()
        {
            this.ResizeRedraw = true;
            this.DoubleBuffered = true;

            this.MinValue = 0.0f;
            this.MaxValue = 100.0f;
            this.StepValue = 10.0f;

            this.Items = new BarChartItemCollection(this);
            this.ActiveItems = new List<BarChartItem>();

            this.AnimationTimer = new Timer { Interval = AnimationTimerInterval };
            this.AnimationTimer.Tick += (s, e) => this.Invalidate();
        }

        private const float BorderCornerRadius = 10.0f;
        private const float TitleMargin = 10.0f;
        private const float ChartMarginTop = TitleMargin;
        private const float ChartMarginLeft = 50.0f;
        private const float ChartMarginRight = ChartMarginTop;
        private const float ChartMarginBottom = 100.0f;
        private const float TickSize = 10.0f;
        private const float HalfTickSize = TickSize / 2.0f;
        private const float BarWidthMin = 20.0f;
        private const float BarWidthMax = 100.0f;
        private const float BarMargin = 5.0f;

        private const int AnimationFramesPerSecond = 40;
        private const int AnimationTimerInterval = 1000 / AnimationFramesPerSecond;
        private const float AnimationFrameValuePercentageAdjustment = 0.008f;

        public float MaxValue 
        {
            get { return this.mMaxValue; }
            set { this.SetAndInvalidate(ref this.mMaxValue, value); }
        } private float mMaxValue;

        public float MinValue 
        {
            get { return this.mMinValue; }
            set { this.SetAndInvalidate(ref this.mMinValue, value); }
        } private float mMinValue;

        public float StepValue
        {
            get { return this.mStepValue; }
            set { this.SetAndInvalidate(ref this.mStepValue, value); }
        } private float mStepValue;
                
        public string Title
        {
            get { return this.mTitle; }
            set { this.SetAndInvalidate(ref this.mTitle, value); }
        } private string mTitle;

        public Font TitleFont
        {
            get { return this.mTitleFont ?? this.Font; }
            set { this.SetAndInvalidate(ref this.mTitleFont, value); }
        } private Font mTitleFont;

        public bool GridLines
        {
            get { return this.mGridLines; }
            set { this.SetAndInvalidate(ref this.mGridLines, value); }
        } private bool mGridLines;

        public BarChartItemCollection Items { get; private set; }
        public ICollection<BarChartItem> ActiveItems { get; private set; }

        private Timer AnimationTimer { get; set; }

        private RectangleF mBorderBounds;
        private SizeF mTitleSize;
        private RectangleF mTitleBounds;
        private RectangleF mChartBounds;

        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);

            this.PaintBorder(e.Graphics);
            this.PaintTitle(e.Graphics);
            this.PaintChartAxis(e.Graphics);
            this.PaintSteps(e.Graphics);
            this.PaintBarItems(e.Graphics);
        }

        private void PaintBorder(Graphics g)
        {
            this.mBorderBounds = new RectangleF(
                this.Padding.Left, this.Padding.Top,
                this.DisplayRectangle.Width - this.Padding.Left - this.Padding.Right,
                this.DisplayRectangle.Height - this.Padding.Top - this.Padding.Bottom);

            g.FillRoundedRectangle(Brushes.AliceBlue, this.mBorderBounds, BorderCornerRadius);
            g.DrawRoundedRectangle(Pens.Black, this.mBorderBounds, BorderCornerRadius);
        }

        private void PaintTitle(Graphics g)
        {
            var lStringFormatCenter = new StringFormat { Alignment = StringAlignment.Center };
            var lTitleLocation = new PointF(this.mBorderBounds.Left + TitleMargin, this.mBorderBounds.Top + TitleMargin);
            this.mTitleSize = g.MeasureString(this.Title, this.TitleFont, lTitleLocation, lStringFormatCenter);
            this.mTitleBounds = new RectangleF(
                this.mBorderBounds.Left + TitleMargin, this.mBorderBounds.Top + TitleMargin,
                this.mBorderBounds.Width - (2.0f * TitleMargin), this.mTitleSize.Height);

            g.DrawString(this.Title, this.TitleFont, Brushes.Black, this.mTitleBounds, lStringFormatCenter);
        }

        private void PaintChartAxis(Graphics g)
        {
            var lChartBoundsY = this.mTitleBounds.Bottom + Math.Max(TitleMargin, ChartMarginTop);
            this.mChartBounds = new RectangleF(
                this.mBorderBounds.Left + ChartMarginLeft, lChartBoundsY,
                this.mBorderBounds.Width - ChartMarginLeft - ChartMarginRight, this.mBorderBounds.Bottom - lChartBoundsY - ChartMarginBottom);

            g.DrawLine(Pens.Black, this.mChartBounds.Left, this.mChartBounds.Bottom, this.mChartBounds.Right, this.mChartBounds.Bottom);
            g.DrawLine(Pens.Black, this.mChartBounds.Left, this.mChartBounds.Bottom, this.mChartBounds.Left, this.mChartBounds.Top);
        }

        private void PaintSteps(Graphics g)
        {
            var lStepPercentage = this.StepValue / (this.MaxValue - this.MinValue);
            var lStepHeight = lStepPercentage * this.mChartBounds.Height;
            var lCurrentStepLocationY = this.mChartBounds.Bottom;
            var lCurrentStepValue = this.MinValue;
            var lStepLocationXStart = this.mChartBounds.Left - HalfTickSize;
            var lStepLocationXEnd = this.GridLines ? this.mChartBounds.Right : this.mChartBounds.Left + HalfTickSize;

            using (var lGridPen = new Pen(Color.Black))
            {
                lGridPen.DashStyle = DashStyle.Dash;

                while (lCurrentStepLocationY >= this.mChartBounds.Top)
                {
                    var lStepText = lCurrentStepValue.ToString();
                    var lStepTextSize = g.MeasureString(lStepText, this.Font);
                    var lStepTextLocation = new PointF(
                        lStepLocationXStart - lStepTextSize.Width, 
                        lCurrentStepLocationY - (lStepTextSize.Height / 2.0f));

                    g.DrawLine(lGridPen, lStepLocationXStart, lCurrentStepLocationY, lStepLocationXEnd, lCurrentStepLocationY);
                    g.DrawString(lStepText, this.Font, Brushes.Black, lStepTextLocation);

                    lCurrentStepValue += this.StepValue;
                    lCurrentStepLocationY -= lStepHeight;
                }
            }
        }

        private void PaintBarItems(Graphics g)
        {
            var lIdealBarWidth = (this.mChartBounds.Width - (BarMargin * (this.Items.Count + 1))) / this.ActiveItems.Count;
            var lBarWidth = Math.Min(BarWidthMax, Math.Max(BarWidthMin, lIdealBarWidth));
            var lCurrentBarLeft = this.mChartBounds.Left + BarMargin;
            //var lAnimationValueAdjustmentAmount = this.mChartBounds.Height * AnimationFrameValuePercentageAdjustment;
            var lAnimationValueAdjustmentAmount = 2.0f;

            bool lAnimationComplete = true;
            foreach (var lItem in this.ActiveItems)
            {
                if (lCurrentBarLeft + lBarWidth > this.mChartBounds.Right)
                {
                    lItem.Hidden = true;
                    continue;
                }

                lAnimationComplete = lAnimationComplete && (lItem.State == BarChartItemState.Normal);
                switch (lItem.State)
                {
                    case BarChartItemState.Invalid:
                        {
                            if (lItem.Value < lItem.AnimationValue)
                            {
                                lItem.AnimationValue -= lAnimationValueAdjustmentAmount;
                                if (lItem.AnimationValue <= lItem.Value)
                                {
                                    lItem.State = BarChartItemState.Normal;
                                    lItem.AnimationValue = lItem.Value;
                                }
                            }
                            else
                            {
                                lItem.AnimationValue += lAnimationValueAdjustmentAmount;
                                if (lItem.AnimationValue >= lItem.Value)
                                {
                                    lItem.State = BarChartItemState.Normal;
                                    lItem.AnimationValue = lItem.Value;
                                }
                            }

                            break;
                        }

                    case BarChartItemState.New:
                        lItem.AnimationValue = 0.0f;
                        lItem.State = BarChartItemState.Invalid;
                        break;
                }

                var lNormalizedValue = lItem.AnimationValue - this.MinValue;
                var lHeightPercentage = lNormalizedValue / (this.MaxValue - this.MinValue);
                var lBarHeight = this.mChartBounds.Height * lHeightPercentage;

                lItem.Hidden = false;
                lItem.Bounds = new RectangleF(
                    lCurrentBarLeft, this.mChartBounds.Bottom - lBarHeight,
                    lBarWidth, lBarHeight);

                using (var lFillBrush = new SolidBrush(lItem.Color))
                {
                    g.FillRectangle(lFillBrush, lItem.Bounds);
                    g.DrawRectangle(Pens.Black, lItem.Bounds);
                }

                lCurrentBarLeft += lBarWidth + BarMargin;
            }

            this.AnimationTimer.Enabled = !lAnimationComplete;
        }

        internal void BarChartItemAdded(BarChartItem item)
        {
            item.State = BarChartItemState.New;
            this.ActiveItems.Add(item);
            this.Invalidate();
        }

        internal void BarChartItemRemoved(BarChartItem item)
        {
            this.ActiveItems.Remove(item);
            this.Invalidate();
        }

        internal void InvalidateBarChartItem(BarChartItem item)
        {
            item.State = BarChartItemState.Invalid;
            this.Invalidate();
        }

        private void SetAndInvalidate<T>(ref T oldValue, T newValue)
        {
            if (object.Equals(oldValue, newValue)) return;
            oldValue = newValue;
            this.Invalidate();
        }
    }
}
