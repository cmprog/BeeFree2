using System;
using System.Linq;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using TccLib.Extensions;
using BeeFree2.GameEntities.MovementBehavior;
using BeeFree2.GameEntities.ShootingBehaviors;

namespace BeeFree2.GameEntities
{
    class Bird : GameEntity, IShooter, IMovable
    {
        public Texture2D Texture { get; set; }

        public int Speed { get; set; }

        public IShootingBehavior ShootingBehavior { get; set; }
        public IMovementBehavior MovementBehavior { get; set; }

        public Bird()
        {
            this.Speed = 200;
        }
        
        public override void LoadContent(ContentManager content)
        {
        }

        public override void Update(GameTime gameTime)
        {
            this.ShootingBehavior.FireWhenReady(gameTime, this.Location);
            this.MovementBehavior.Move(this, gameTime);
        }

        public override void Draw(SpriteBatch spriteBatch)
        {
            spriteBatch.Draw(this.Texture, this.Bounds, Color.White);
        }
    }
}
