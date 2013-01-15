using System;
using Microsoft.Xna.Framework;

namespace BeeFree2.GameEntities.ShootingBehaviors
{
    interface IShootingBehavior
    {
        void FireWhenReady(GameTime gameTime, Vector2 location);
    }
}
