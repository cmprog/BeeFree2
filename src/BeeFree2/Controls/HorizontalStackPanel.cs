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

                switch (lChild.VerticalAlignment)
                {
                    case VerticalAlignment.Top:
                        lChild.ActualHeight = MathHelper.Min(lChild.DesiredHeight, lContentBounds.Height);
                        lChild.Y = lContentBounds.Y;
                        break;

                    case VerticalAlignment.Bottom:
                        lChild.ActualHeight = MathHelper.Min(lChild.DesiredHeight, lContentBounds.Height);
                        lChild.Y = lContentBounds.Y + lChild.ActualHeight;
                        break;

                    case VerticalAlignment.Center:
                        lChild.ActualHeight = MathHelper.Min(lChild.DesiredHeight, this.ActualHeight);
                        lChild.Y = lContentBounds.Y + ((lContentBounds.Height - lChild.ActualHeight) / 2f);
                        break;

                    case VerticalAlignment.Stretch:
                        lChild.ActualHeight = lContentBounds.Height;
                        lChild.Y = lContentBounds.Y;
                        break;
                }

                lCurrentX += lChild.ActualWidth;
            }

            base.LayoutChildren(gameTime);
        }
    }
}
