using BeeFree2.Controls;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace BeeFree2
{
    /// <summary>
    /// Defines a 9-box grid which represents the various portions of a button which can be scaled
    /// in 2d space without distortion.
    /// </summary>
    public sealed class BoxScale
    {
        private readonly int mCornerWidth;
        private readonly int mCornerWidth2;

        private readonly int mCornerHeight;
        private readonly int mCornerHeight2;

        private readonly int mClientWidth;
        private readonly int mClientHeight;

        public BoxScale(Rectangle bounds, int cornerSize)
            : this(bounds, cornerSize, cornerSize)
        {

        }

        public BoxScale(Rectangle bounds, int cornerWidth, int cornerHeight)
        {
            this.mCornerWidth = cornerWidth;
            this.mCornerWidth2 = cornerWidth + cornerWidth;

            this.mCornerHeight = cornerHeight;
            this.mCornerHeight2 = cornerHeight + cornerHeight;

            this.mClientWidth = bounds.Width - this.mCornerWidth2;
            this.mClientHeight = bounds.Height - this.mCornerHeight2;

            this.CornerThickness = new ThicknessF(this.mCornerWidth, this.mCornerHeight, this.mCornerWidth, this.mCornerHeight);

            var lLeftColX = bounds.X;
            var lMiddleColX = bounds.X + this.mCornerWidth;
            var lRightColX = bounds.Right - this.mCornerWidth;

            var lTopRowY = bounds.Y;
            var lMiddleRowY = bounds.Y + this.mCornerHeight;
            var lBottomRowY = bounds.Bottom - this.mCornerHeight;

            this.TopLeft = new Rectangle(lLeftColX, lTopRowY, this.mCornerWidth, this.mCornerHeight);
            this.TopMIddle = new Rectangle(lMiddleColX, lTopRowY, this.mClientWidth, this.mCornerHeight);
            this.TopRight = new Rectangle(lRightColX, lTopRowY, this.mCornerWidth, this.mCornerHeight);
                        
            this.MiddleLeft = new Rectangle(lLeftColX, lMiddleRowY, this.mCornerWidth, this.mClientHeight);
            this.MiddleMiddle = new Rectangle(lMiddleColX, lMiddleRowY, this.mClientWidth, this.mClientHeight);
            this.MiddleRight = new Rectangle(lRightColX, lMiddleRowY, this.mCornerWidth, this.mClientHeight);

            this.BottomLeft = new Rectangle(lLeftColX, lBottomRowY, this.mCornerWidth, this.mCornerHeight);
            this.BottomMiddle = new Rectangle(lMiddleColX, lBottomRowY, this.mClientWidth, this.mCornerHeight);
            this.BottomRight = new Rectangle(lRightColX, lBottomRowY, this.mCornerWidth, this.mCornerHeight);
        }

        public Rectangle TopLeft { get; }

        public Rectangle TopMIddle { get; }

        public Rectangle TopRight { get; }

        public Rectangle MiddleLeft { get; }

        public Rectangle MiddleMiddle { get; }

        public Rectangle MiddleRight { get; }

        public Rectangle BottomLeft{ get; }

        public Rectangle BottomMiddle { get; }

        public Rectangle BottomRight { get; }

        public ThicknessF CornerThickness { get; }

        /// <summary>
        /// Draws the source sprite from the given spritesheet texture to the given bounds.
        /// </summary>
        /// <remarks>
        /// The bounds should be at least as large as the double-corner size of the button
        /// scale in order to have any valid client area.
        /// </remarks>
        public void Draw(SpriteBatch spriteBatch, Texture2D spriteSheet, RectangleF targetBounds)
        {
            var lScaleX = (targetBounds.Width - this.mCornerWidth2) / this.mClientWidth;
            var lScaleY = (targetBounds.Height - this.mCornerHeight2) / this.mClientHeight;

            var lScaleHorizontal = new Vector2(lScaleX, 1);
            var lScaleVertical = new Vector2(1, lScaleY);
            var lScaleClient = new Vector2(lScaleX, lScaleY);

            var lLeftColX = targetBounds.X;
            var lMiddleColX = targetBounds.X + this.mCornerWidth;
            var lRightColX = targetBounds.Right - this.mCornerWidth;

            var lTopRowY = targetBounds.Y;
            var lMiddleRowY = targetBounds.Y + this.mCornerHeight;
            var lBottomRowY = targetBounds.Bottom - this.mCornerHeight;

            spriteBatch.Draw(spriteSheet, new Vector2(lLeftColX, lTopRowY), this.TopLeft, Color.White, 0, Vector2.Zero, Vector2.One, SpriteEffects.None, 0);
            spriteBatch.Draw(spriteSheet, new Vector2(lMiddleColX, lTopRowY), this.TopMIddle, Color.White, 0, Vector2.Zero, lScaleHorizontal, SpriteEffects.None, 0);
            spriteBatch.Draw(spriteSheet, new Vector2(lRightColX, lTopRowY), this.TopRight, Color.White, 0, Vector2.Zero, Vector2.One, SpriteEffects.None, 0);

            spriteBatch.Draw(spriteSheet, new Vector2(lLeftColX, lMiddleRowY), this.MiddleLeft, Color.White, 0, Vector2.Zero, lScaleVertical, SpriteEffects.None, 0);
            spriteBatch.Draw(spriteSheet, new Vector2(lMiddleColX, lMiddleRowY), this.MiddleMiddle, Color.White, 0, Vector2.Zero, lScaleClient, SpriteEffects.None, 0);
            spriteBatch.Draw(spriteSheet, new Vector2(lRightColX, lMiddleRowY), this.MiddleRight, Color.White, 0, Vector2.Zero, lScaleVertical, SpriteEffects.None, 0);

            spriteBatch.Draw(spriteSheet, new Vector2(lLeftColX, lBottomRowY), this.BottomLeft, Color.White, 0, Vector2.Zero, Vector2.One, SpriteEffects.None, 0);
            spriteBatch.Draw(spriteSheet, new Vector2(lMiddleColX, lBottomRowY), this.BottomMiddle, Color.White, 0, Vector2.Zero, lScaleHorizontal, SpriteEffects.None, 0);
            spriteBatch.Draw(spriteSheet, new Vector2(lRightColX, lBottomRowY), this.BottomRight, Color.White, 0, Vector2.Zero, Vector2.One, SpriteEffects.None, 0);
        }
    }
}
