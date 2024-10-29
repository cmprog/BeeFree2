using Microsoft.Xna.Framework;

namespace BeeFree2.Controls
{
    public sealed class Grid : GraphicsPanel
    {
        public override Vector2 MeasureCore(GameTime gameTime)
        {
            base.MeasureCore(gameTime);

            var lMaxWidth = 0.0f;
            var lMaxHeight = 0.0f;

            foreach (var lChild in this.Children)
            {
                lMaxWidth = MathHelper.Max(lChild.DesiredWidth, lMaxWidth);
                lMaxHeight = MathHelper.Max(lChild.DesiredHeight, lMaxHeight);
            }

            return new Vector2(lMaxWidth, lMaxHeight);
        }

        public override void LayoutChildren(GameTime gameTime)
        {
            foreach (var lChild in this.Children)
            {
                lChild.ApplyAlignment(this.ContentBounds);

                if (lChild is IGraphicsContainer lChildContainer)
                {
                    lChildContainer.LayoutChildren(gameTime);
                }
            }
        }
    }
}
