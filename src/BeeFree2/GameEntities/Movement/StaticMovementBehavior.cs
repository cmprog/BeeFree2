using System;
using Microsoft.Xna.Framework;

namespace BeeFree2.GameEntities.Movement
{
    /// <summary>
    /// A static movement means the item actually does not move.
    /// </summary>
    internal class StaticMovementBehavior : IMovementBehavior
    {
        /// <summary>
        /// Gets or sets the position of the entity.
        /// </summary>
        public Vector2 Position { get; set; }

        /// <summary>
        /// Gets or sets the velocity (speed and direction) of the entity.
        /// </summary>
        public Vector2 Velocity { get; set; }

        /// <summary>
        /// Gets or sets the acceleration (value and direction) of the entity.
        /// </summary>
        public Vector2 Acceleration { get; set; }

        /// <summary>
        /// Does nothing - the entity doen't move.
        /// </summary>
        /// <param name="entity">The entity to move.</param>
        /// <param name="gameTime">The current game time.</param>
        public void Move(IMovableEntity entity, GameTime gameTime)
        {
        }
    }
}
