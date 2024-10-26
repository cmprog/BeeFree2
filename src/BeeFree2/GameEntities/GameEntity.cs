using System;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;

namespace BeeFree2.GameEntities
{
    abstract class GameEntity
    {
        public Vector2 ScreenSize { get; set; }

        public Vector2 Size { get; set; }
        public Vector2 Location { get; set; }

        public Rectangle Bounds
        {
            get
            {
                return new Rectangle(
                    (int)this.Location.X,
                    (int)this.Location.Y,
                    (int)this.Size.X,
                    (int)this.Size.Y);
            }
        }

        public abstract void LoadContent(ContentManager content);
        public abstract void Update(GameTime seconds);
        public abstract void Draw(SpriteBatch spriteBatch);
    }
}
