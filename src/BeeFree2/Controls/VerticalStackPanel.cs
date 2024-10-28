using Microsoft.Xna.Framework;

namespace BeeFree2.Controls
{
    public sealed class VerticalStackPanel : GraphicsPanel
    {
        public override Vector2 MeasureCore(GameTime gameTime)
        {
            base.MeasureCore(gameTime);

            var lTotalHeight = 0.0f;
            var lMaxWidth = 0.0f;

            foreach (var lChild in this.Children)
            {
                lMaxWidth = MathHelper.Max(lChild.DesiredWidth, lMaxWidth);
                lTotalHeight += lChild.DesiredHeight;
            }

            return new Vector2(lMaxWidth, lTotalHeight);      
        }

        public override void LayoutChildren(GameTime gameTime)
        {
            var lContentBounds = this.ContentBounds;

            var lCurrentY = lContentBounds.Y;

            foreach (var lChild in this.Children)
            {
                lChild.Y = lCurrentY;
                lChild.ActualHeight = lChild.DesiredHeight;

                switch (lChild.HorizontalAlignment)
                {
                    case HorizontalAlignment.Left:
                        lChild.X = lContentBounds.X;
                        lChild.ActualWidth = MathHelper.Min(lChild.DesiredWidth, lContentBounds.Width);
                        break;

                    case HorizontalAlignment.Right:                        
                        lChild.ActualWidth = MathHelper.Min(lChild.DesiredWidth, lContentBounds.Width);
                        lChild.X = lContentBounds.X + lChild.ActualWidth;
                        break;

                    case HorizontalAlignment.Center:
                        lChild.ActualWidth = MathHelper.Min(lChild.DesiredWidth, this.ActualWidth);
                        lChild.X = lContentBounds.X + ((lContentBounds.Width - lChild.ActualWidth) / 2f);
                        break;

                    case HorizontalAlignment.Stretch:
                        lChild.ActualWidth = lContentBounds.Width;
                        lChild.X = lContentBounds.X;
                        break;
                }

                lChild.Clip = lChild.Bounds.Intersection(this.Clip);

                lCurrentY += lChild.ActualHeight;
            }

            base.LayoutChildren(gameTime);
        }
    }
}
