using System;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace BeeFree2.GameEntities
{
    class MainMenuButton
    {
        public string Text { get; set; }
        
        public SpriteFont InactiveFont { get; set; }
        public SpriteFont ActiveFont { get; set; }

        public Vector2 Size { get; set; }
        public Vector2 Position { get; set; }
        public Texture2D BlankTexture { get; set; }

        /// <summary>
        /// Gets or sets whether or not this button is enabled.
        /// </summary>
        public bool IsEnabled { get; set; }

        /// <summary>
        /// Gets or sets whether or not this button is active.
        /// </summary>
        public bool IsActive { get; set; }

        public Rectangle Bounds
        {
            get
            {
                return 
                    new Rectangle(
                        (int)this.Position.X,
                        (int)this.Position.Y,
                        (int)this.Size.X,
                        (int)this.Size.Y);
            }
        }
        
        public event EventHandler Selected;

        protected internal virtual void OnSelectEntry()
        {
            this.Selected.Fire(this);
        }

        public virtual void Draw(SpriteBatch spriteBatch)
        {
            var lFont = this.IsActive ? this.ActiveFont : this.InactiveFont;

            var lTextSize = lFont.MeasureString(this.Text);
            var lTextLocation = this.Position + ((this.Size - lTextSize) / 2f);

            const float lcBorderThickness = 4;

            spriteBatch.Draw(this.BlankTexture, this.Position, null, Color.Gold, 0, Vector2.Zero, this.Size, SpriteEffects.None, 0);
            spriteBatch.Draw(this.BlankTexture, this.Position, null, Color.Black, 0, Vector2.Zero, new Vector2(this.Size.X, lcBorderThickness), SpriteEffects.None, 0);
            spriteBatch.Draw(this.BlankTexture, this.Position, null, Color.Black, 0, Vector2.Zero, new Vector2(lcBorderThickness, this.Size.Y), SpriteEffects.None, 0);
            spriteBatch.Draw(this.BlankTexture, new Vector2(this.Position.X + this.Size.X - lcBorderThickness, this.Position.Y), null, Color.Black, 0, Vector2.Zero, new Vector2(lcBorderThickness, this.Size.Y), SpriteEffects.None, 0);
            spriteBatch.Draw(this.BlankTexture, new Vector2(this.Position.X, this.Position.Y + this.Size.Y - lcBorderThickness), null, Color.Black, 0, Vector2.Zero, new Vector2(this.Size.X, lcBorderThickness), SpriteEffects.None, 0);
            spriteBatch.DrawString(lFont, this.Text, lTextLocation, Color.Black);
        }
    }
}
