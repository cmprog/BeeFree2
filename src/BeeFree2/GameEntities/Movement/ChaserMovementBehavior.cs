using System;
using Microsoft.Xna.Framework;

namespace BeeFree2.GameEntities.Movement
{
    /// <summary>
    /// Defines a movement behaviors which will cause attempt to follow another movable entity.
    /// </summary>
    internal class ChaserMovementBehavior : IMovementBehavior
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
        /// This movement pattern attempts to follow another entity.
        /// </summary>
        /// <param name="entity">The entity to move.</param>
        /// <param name="gameTime">The current game time.</param>
        public void Move(IMovableEntity entity, GameTime gameTime)
        {
            // We will follow the other entity by constantly shifting
            // our velocity vector to point toward the other entity.
            // We follow all other physical laws.

            // Any acceleration only effects our speed increase per second
            // and will not cause us to change direction off of our target.

            System.Diagnostics.Debug.Assert(entity != null);
            System.Diagnostics.Debug.Assert(gameTime != null);

            var lSeconds = (float)gameTime.ElapsedGameTime.TotalSeconds;
            var lSpeed = this.Velocity.Length() + (this.Acceleration.Length() * lSeconds);

            var lDirection = this.TargetEntity.MovementBehavior.Position - this.Position;
            lDirection.Normalize();            

            this.Velocity = lDirection * lSpeed;
            this.Position += this.Velocity * lSeconds;
        }
    }
}
