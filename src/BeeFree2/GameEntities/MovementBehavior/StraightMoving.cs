using System;
using Microsoft.Xna.Framework;

namespace BeeFree2.GameEntities.MovementBehavior
{
    class StraightMoving : IMovementBehavior
    {
        private Vector2 Direction { get; set; }
        private Vector2 ScreenSize { get; set; }

        public StraightMoving(Vector2 direction)
        {
            this.ScreenSize = Vector2.Zero;
            this.Direction = direction;
        }

        public StraightMoving(Vector2 screenSize, Vector2 direction)
        {
            this.ScreenSize = screenSize;
            this.Direction = direction;
        }

        public void Move(IMovable movable, GameTime gameTime)
        {
            var lSeconds = (float)gameTime.ElapsedGameTime.TotalSeconds;

            if (this.ScreenSize == Vector2.Zero)
            {
                movable.Location = movable.Location + (this.Direction * lSeconds * movable.Speed);
            }
            else
            {
                movable.Location =
                    Vector2.Clamp(
                            movable.Location + (this.Direction * lSeconds * movable.Speed),
                            Vector2.Zero, this.ScreenSize + movable.Size);
            }
        }
    }
}
