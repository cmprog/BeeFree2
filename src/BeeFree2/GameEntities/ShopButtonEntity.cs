using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace BeeFree2.GameEntities
{
    /// <summary>
    /// Represents a single button in the shop.
    /// The buttons are represented by an icon and a summary of information.
    /// </summary>
    public class ShopButtonEntity
    {
        /// <summary>
        /// Creates a new shop button entity.
        /// </summary>
        public ShopButtonEntity()
        {
            this.Size = new Vector2(180, 90);
        }

        /// <summary>
        /// Gets or sets the ID for the upgrade this button represents.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the name of the upgrade.
        /// </summary>
        public string NameText { get; set; }

        /// <summary>
        /// Gets or sets the level associated with this button.
        /// </summary>
        public int Level { get; set; }

        /// <summary>
        /// Gets or sets the level of the upgrade.
        /// </summary>
        public string LevelText { get; set; }

        /// <summary>
        /// Gets or sets the description of the upgrade.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the price of the upgrade.
        /// </summary>
        public int Price { get; set; }

        /// <summary>
        /// Gets or sets the text representation of the price.
        /// </summary>
        public string PriceText { get; set; }

        /// <summary>
        /// Gets or sets the font to render the text with.
        /// </summary>
        public SpriteFont Font { get; set; }

        /// <summary>
        /// Gets or sets a bold font to use for the name.
        /// </summary>
        public SpriteFont BoldFont { get; set; }

        /// <summary>
        /// Gets or sets the size of the icon.
        /// </summary>
        public Vector2 IconSize { get; set; }

        /// <summary>
        /// Gets or sets the texture to use for the icon.
        /// </summary>
        public Texture2D IconTexture { get; set; }

        /// <summary>
        /// Gets or sets the position of the button.
        /// </summary>
        public Vector2 Position { get; set; }

        /// <summary>
        /// Gets the size of the button.
        /// </summary>
        public Vector2 Size { get; private set; }

        /// <summary>
        /// Draws the button with the given sprite batch.
        /// </summary>
        /// <param name="spriteBatch">The sprite batch used to draw.</param>
        public void Draw(SpriteBatch spriteBatch)
        {
            var lNameTextSize = this.BoldFont.MeasureString(this.NameText);

            var lLevelPosition = this.Position + (Vector2.UnitX * this.IconSize.X);
            var lPricePosition = lLevelPosition + (Vector2.UnitY * this.Font.LineSpacing);
            var lNamePosition = new Vector2(
                this.Position.X + ((this.Size.X - lNameTextSize.X) / 2),
                this.Position.Y + this.IconSize.Y);

            if (this.IconTexture != null)
            {
                spriteBatch.Draw(this.IconTexture, this.Position, Color.White);
            }
            
            spriteBatch.DrawString(this.BoldFont, this.NameText, lNamePosition, Color.Black);

            if (this.LevelText != null)
            {
                spriteBatch.DrawString(this.Font, this.LevelText, lLevelPosition, Color.Black);
            }

            if (this.PriceText != null)
            {
                spriteBatch.DrawString(this.Font, this.PriceText, lPricePosition, Color.Black);
            }            
        }

        /// <summary>
        /// Determines whether the given point will be considered a hit on the button.
        /// </summary>
        /// <param name="x">The x-position to check.</param>
        /// <param name="y">The y-position to check.</param>
        /// <returns>True if the click counds, false otherwise.</returns>
        public bool HitTest(float x, float y)
        {
            return GraphicsUtilities.RectangleContains(this.Position, this.IconSize, x, y);
        }
    }
}
