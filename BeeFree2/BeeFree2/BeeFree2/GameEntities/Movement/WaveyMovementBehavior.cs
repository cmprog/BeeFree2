using System;
using Microsoft.Xna.Framework;

namespace BeeFree2.GameEntities.Movement
{
    /// <summary>
    /// This behavior will cause the entity to follow a sin-wave.
    /// </summary>
    internal class WaveyMovementBehavior : IMovementBehavior
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
        /// Gets or sets the radius to follow in both the x and y directions.
        /// </summary>
        public Vector2 Radius { get; set; }

        /// <summary>
        /// Gets or sets the total period of the wave.
        /// </summary>
        public TimeSpan Period { get; set; }

        /// <summary>
        /// Gets the position of the entity if it were not offset. The entity really just moves
        /// along this line with calculates offsets based on the time and radius.
        /// </summary>
        private Vector2 NonOffsetPosition { get; set; }

        /// <summary>
        /// Moves the entity in the shape of a sin wave.
        /// </summary>
        /// <param name="entity">The entity to move.</param>
        /// <param name="gameTime">The current game time.</param>
        public void Move(IMovableEntity entity, GameTime gameTime)
        {
            System.Diagnostics.Debug.Assert(entity != null);
            System.Diagnostics.Debug.Assert(gameTime != null);

            // If the non-offset position has not been changed yet,
            // we set it to the position.
            if (this.NonOffsetPosition == Vector2.Zero)
            {
                this.NonOffsetPosition = this.Position;
            }

            var lSeconds = (float)gameTime.ElapsedGameTime.TotalSeconds;
            this.Velocity += this.Acceleration * lSeconds;
            this.NonOffsetPosition += this.Velocity * lSeconds;

            var lSineSeconds = (float)Math.Sin(gameTime.TotalGameTime.TotalSeconds * (Math.PI / this.Period.TotalSeconds));
            var lOffset = this.Radius * lSineSeconds;
            this.Position = this.NonOffsetPosition + lOffset;
        }
    }
}
