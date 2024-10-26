using System;
using Microsoft.Xna.Framework;

namespace BeeFree2.GameEntities.Movement
{
    /// <summary>
    /// This behavior is the most basic. It will move the entity based on its current velocity
    /// and acceleration values. It will only update velocity based on the acceleration value.
    /// </summary>
    internal class StraightMovementBehavior : IMovementBehavior
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
        /// Moves the entity via basic newtonian physics based on the acceleration/velocity/position of the entity.
        /// </summary>
        /// <param name="entity">The entity to move.</param>
        /// <param name="gameTime">The current game time.</param>
        public void Move(IMovableEntity entity, GameTime gameTime)
        {
            System.Diagnostics.Debug.Assert(entity != null);
            System.Diagnostics.Debug.Assert(gameTime != null);

            var lSeconds = (float)gameTime.ElapsedGameTime.TotalSeconds;
            this.Velocity += this.Acceleration * lSeconds;
            this.Position += this.Velocity * lSeconds;
        }
    }
}
