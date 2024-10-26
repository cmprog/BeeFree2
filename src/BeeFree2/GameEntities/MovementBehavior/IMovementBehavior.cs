using System;
using Microsoft.Xna.Framework;

namespace BeeFree2.GameEntities.MovementBehavior
{
    interface IMovementBehavior
    {
        void Move(IMovable movable, GameTime gameTime);
    }
}
