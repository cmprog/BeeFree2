using System;
using Microsoft.Xna.Framework;

namespace BeeFree2.GameEntities.Movement
{
    /// <summary>
    /// Defines a behavior for moving a movable entity.
    /// </summary>
    public interface IMovementBehavior
    {
        /// <summary>
        /// Moves the given entity based on the given game time.
        /// </summary>
        /// <param name="entity">The entity to move.</param>
        /// <param name="gameTime">The current game time.</param>
        void Move(IMovableEntity entity, GameTime gameTime);

        /// <summary>
        /// Gets or sets the position of the entity.
        /// </summary>
        Vector2 Position { get; set; }

        /// <summary>
        /// Gets or sets the velocity (speed and direction) of the entity.
        /// </summary>
        Vector2 Velocity { get; set; }

        /// <summary>
        /// Gets or sets the acceleration (value and direction) of the entity.
        /// </summary>
        Vector2 Acceleration { get; set; }
    }
}
