using Microsoft.Xna.Framework;
using System;

namespace BeeFree2.Controls
{
    public sealed class UniformGrid : GraphicsPanel
    {
        public int RowCount { get; set; } = 1;

        public int ColumnCount { get; set; } = 1;

        public override Vector2 MeasureCore(GameTime gameTime)
        {
            if (this.RowCount <= 0 || this.ColumnCount <= 0) return Vector2.Zero;

            base.MeasureCore(gameTime);

            var lMaxWidth = 0.0f;
            var lMaxHeight = 0.0f;

            foreach (var lChild in this.Children)
            {
                lMaxWidth = MathHelper.Max(lChild.DesiredWidth, lMaxWidth);
                lMaxHeight = MathHelper.Max(lChild.DesiredHeight, lMaxHeight);
            }

            return new Vector2(lMaxWidth * this.ColumnCount, lMaxHeight * this.RowCount);
        }

        public override void LayoutChildren(GameTime gameTime)
        {
            var lContentBounds = this.ContentBounds;
            var lCellSize = new Vector2(lContentBounds.Width / this.ColumnCount, lContentBounds.Height / this.RowCount);

            var lClientBounds = new RectangleF(Vector2.Zero, lCellSize);

            for (var lChildIndex = 0; lChildIndex < this.Children.Count; lChildIndex++)
            {
                var (lRowIndex, lColumnIndex) = Math.DivRem(lChildIndex, this.ColumnCount);

                lClientBounds.X = lColumnIndex * lCellSize.X;
                lClientBounds.Y = lRowIndex * lCellSize.Y; ;

                var lChild = this.Children[lChildIndex];
                lChild.ApplyAlignment(lClientBounds);

                if (lChild is IGraphicsContainer lChildContainer)
                {
                    lChildContainer.LayoutChildren(gameTime);
                }
            }
        }
    }
}
