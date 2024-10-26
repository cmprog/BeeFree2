using System;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace BeeFree2.GameEntities
{
    /// <summary>
    /// Defines the button representing a 
    /// </summary>
    internal class LevelSelectionButton
    {
        /// <summary>
        /// Gets or sets the texture representing the object to be drawn.
        /// </summary>
        public Texture2D Texture { get; set; }

        public Texture2D PerfectTexture { get; set; }
        public Texture2D FlawlessTexture { get; set; }

        /// <summary>
        /// Gets or sets the position of the entity.
        /// </summary>
        public Vector2 Position { get; set; }

        /// <summary>
        /// Gets or sets the size of the entity.
        /// </summary>
        public Vector2 Size { get; set; }

        /// <summary>
        /// Gets the text to display within the button.
        /// </summary>
        public string Text { get; set; }

        /// <summary>
        /// Gets or sets the index of the level this button represents.
        /// </summary>
        public int LevelIndex { get; set; }

        /// <summary>
        /// Gets or sets whether this level is clickable.
        /// </summary>
        public bool IsAvailable { get; set; }

        /// <summary>
        /// Gets or sets whether this level has been played perfectly.
        /// </summary>
        public bool IsPerfect { get; set; }

        /// <summary>
        /// Gets or sets whether this level has been played flawlessly.
        /// </summary>
        public bool IsFlawless { get; set; }

        /// <summary>
        /// Gets or sets a font to use when this button is active.
        /// </summary>
        public SpriteFont ActiveFont { get; set; }

        /// <summary>
        /// Gets or sets a font to use when this button is inactive.
        /// </summary>
        public SpriteFont InactiveFont { get; set; }

        /// <summary>
        /// Gets or sets a value indicating this button is active.
        /// </summary>
        public bool IsActive { get; set; }

        /// <summary>
        /// Fired when OnSelected is called.
        /// </summary>
        public event EventHandler Selected;

        /// <summary>
        /// Fires the Selected event handler.
        /// </summary>
        public void OnSelected()
        {
            this.Selected.Fire(this);
        }

        /// <summary>
        /// Draws the button using the given SpriteBatch.
        /// </summary>
        /// <param name="spriteBatch">The sprite batch to use to draw the button.</param>
        public void Draw(SpriteBatch spriteBatch)
        {
            var lFont = this.IsActive ? this.ActiveFont : this.InactiveFont;
            var lTintColor = this.IsAvailable ? Color.White : Color.Gray;

            var lTextSize = lFont.MeasureString(this.Text);
            var lTextLocation = this.Position + ((this.Size - lTextSize) / 2f);

            spriteBatch.Draw(this.Texture, this.Position, lTintColor);
            spriteBatch.DrawString(lFont, this.Text, lTextLocation, Color.Black);

            var lPadding = 3;
            var lFlawlessPosition = this.Position + this.Size - new Vector2(this.FlawlessTexture.Width + lPadding, this.FlawlessTexture.Height + lPadding);
            var lPerfectPosition = lFlawlessPosition - (Vector2.UnitX * this.PerfectTexture.Width);

            if (this.IsFlawless) spriteBatch.Draw(this.FlawlessTexture, lFlawlessPosition, Color.Yellow);
            if (this.IsPerfect) spriteBatch.Draw(this.PerfectTexture, lPerfectPosition, Color.Yellow);
        }
    }
}
