using System;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;

namespace BeeFree2.GameEntities
{
    /// <summary>
    /// The HeadsUpDisplay gives the user various pieces of information such as heath, etc.
    /// </summary>
    internal class HeadsUpDisplayEntity
    {
        private Texture2D BlankTexture { get; set; }

        private Vector2 HealthBarLocation { get; set; }
        public Vector2 HealthBarSize { get; set; }
        
        /// <summary>
        /// Gets or sets the current percentage of health to display.
        /// </summary>
        public float HealthPercentage { get; set; }

        public GraphicsDevice GraphicsDevice { get; set; }
        public Vector2 ScreenSize { get; set; }

        public void Activate()
        {
            this.BlankTexture = new Texture2D(this.GraphicsDevice, 1, 1);
            this.BlankTexture.SetData(new[] { Color.White });

            this.HealthBarLocation = new Vector2(10, 10);
        }

        public void Draw(SpriteBatch spriteBatch, GameTime gameTime)
        {
            spriteBatch.Draw(this.BlankTexture, this.HealthBarLocation, null, Color.Red, 0, Vector2.Zero, new Vector2(this.HealthBarSize.X * this.HealthPercentage, this.HealthBarSize.Y), SpriteEffects.None, 0);
            spriteBatch.Draw(this.BlankTexture, this.HealthBarLocation, null, Color.Black, 0, Vector2.Zero, new Vector2(this.HealthBarSize.X, 1), SpriteEffects.None, 0);
            spriteBatch.Draw(this.BlankTexture, this.HealthBarLocation, null, Color.Black, 0, Vector2.Zero, new Vector2(1, this.HealthBarSize.Y), SpriteEffects.None, 0);
            spriteBatch.Draw(this.BlankTexture, new Vector2(this.HealthBarLocation.X + this.HealthBarSize.X, this.HealthBarLocation.Y), null, Color.Black, 0, Vector2.Zero, new Vector2(1, this.HealthBarSize.Y), SpriteEffects.None, 0);
            spriteBatch.Draw(this.BlankTexture, new Vector2(this.HealthBarLocation.X, this.HealthBarLocation.Y + this.HealthBarSize.Y), null, Color.Black, 0, Vector2.Zero, new Vector2(this.HealthBarSize.X, 1), SpriteEffects.None, 0);
        }
    }
}
