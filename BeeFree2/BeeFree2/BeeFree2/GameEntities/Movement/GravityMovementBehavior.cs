using System;
using Microsoft.Xna.Framework;

namespace BeeFree2.GameEntities.Movement
{
    /// <summary>
    /// Defines a movement behaviors which will move toward another entity as if the other entity were a gravity source.
    /// </summary>
    internal class GravityMovementBehavior : IMovementBehavior
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
        /// The entity to follow.
        /// </summary>
        public IMovableEntity TargetEntity { get; set; }

        /// <summary>
        /// This movement hints an item to move toward the target as if
        /// the target weere a source of gravity.
        /// </summary>
        /// <param name="entity">The entity to move.</param>
        /// <param name="gameTime">The current game time.</param>
        public void Move(IMovableEntity entity, GameTime gameTime)
        {
            // We will move toward the entity as normal, but we will
            // move the direction of the acceleration vector to
            // always point toward the target entity.

            // We also don't adjust the speed of the entity,
            // only its direction.

            System.Diagnostics.Debug.Assert(entity != null);
            System.Diagnostics.Debug.Assert(gameTime != null);

            var lSeconds = (float)gameTime.ElapsedGameTime.TotalSeconds;
            this.Acceleration = Vector2.Normalize(this.TargetEntity.MovementBehavior.Position - this.Position) * this.Acceleration.Length();
            this.Velocity = Vector2.Normalize(this.Velocity + (this.Acceleration * lSeconds)) * this.Velocity.Length();
            this.Position += this.Velocity * lSeconds;
        }
    }
}
