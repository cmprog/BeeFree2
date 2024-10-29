using Microsoft.Xna.Framework;

namespace BeeFree2.Controls
{
    public sealed class HorizontalStackPanel : GraphicsPanel
    {
        public override Vector2 MeasureCore(GameTime gameTime)
        {
            base.MeasureCore(gameTime);

            var lTotalWidth = 0.0f;
            var lMaxHeight = 0.0f;

            foreach (var lChild in this.Children)
            {
                lMaxHeight = MathHelper.Max(lChild.DesiredHeight, lMaxHeight);
                lTotalWidth += lChild.DesiredWidth;
            }

            return new Vector2(lTotalWidth, lMaxHeight);
        }

        public override void LayoutChildren(GameTime gameTime)
        {
            var lContentBounds = this.ContentBounds;

            var lCurrentX = lContentBounds.X;

            foreach (var lChild in this.Children)
            {
                lChild.X = lCurrentX;
                lChild.ActualWidth = lChild.DesiredWidth;

                lChild.ApplyVerticalAlignment(lContentBounds);

                if (lChild is IGraphicsContainer lChildContainer)
                {
                    lChildContainer.LayoutChildren(gameTime);
                }

                lCurrentX += lChild.ActualWidth;
            }

            base.LayoutChildren(gameTime);
        }
    }
}
