﻿using Microsoft.Xna.Framework;

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

                lChild.ApplyHorizontalAlignment(lContentBounds);
                lChild.Clip = lChild.Bounds.Intersection(this.Clip);

                if (lChild is IGraphicsContainer lChildContainer)
                {
                    lChildContainer.LayoutChildren(gameTime);
                }

                lCurrentY += lChild.ActualHeight;
            }

            base.LayoutChildren(gameTime);
        }
    }
}
