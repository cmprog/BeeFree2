using System;
using System.Linq;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using TccLib.Extensions;

namespace BeeFree2.GameEntities
{
    class Bullet : GameEntity
    {
        private Texture2D Texture { get; set; }
        public Vector2 Direction { get; set; }

        public int Speed { get; set; }

        public override void LoadContent(ContentManager content)
        {
            this.Texture = content.Load<Texture2D>("sprites/bullet");
            this.Size = new Vector2(this.Texture.Width, this.Texture.Height);
        }

        public override void Update(GameTime gameTime)
        {
            var lSeconds = (float)gameTime.ElapsedGameTime.TotalSeconds;
            this.Location =
                Vector2.Clamp(
                    this.Location + (this.Direction * lSeconds * this.Speed),
                    Vector2.Zero, this.ScreenSize + this.Size);
        }

        public override void Draw(SpriteBatch spriteBatch)
        {
            spriteBatch.Draw(this.Texture, this.Bounds, Color.White);
        }
    }
}
