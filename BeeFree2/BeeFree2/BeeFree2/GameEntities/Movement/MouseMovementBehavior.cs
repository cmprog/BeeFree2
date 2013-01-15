using System;
using Microsoft.Xna.Framework;
using TccLib.Xna.GameStateManagement;

namespace BeeFree2.GameEntities.Movement
{
    /// <summary>
    /// This behavior causes the entity to move toward the mouse position.
    /// </summary>
    internal class MouseMovementBehavior : IMovementBehavior
    {
        /// <summary>
        /// Creates a new mouse movement behavior with the given input state.
        /// </summary>
        /// <param name="inputState">The input state will be used to capture the mouse movement.</param>
        public MouseMovementBehavior(InputState inputState)
        {
            this.InputState = inputState;
        }

        /// <summary>
        /// Gets or sets the InputState used to get mose movement.
        /// </summary>
        public InputState InputState { get; private set; }

        /// <summary>
        /// Moves the entity toward the current mouse position.
        /// </summary>
        /// <param name="entity">The entity to move.</param>
        /// <param name="gameTime">The game time.</param>
        public void Move(IMovableEntity entity, GameTime gameTime)
        {
            System.Diagnostics.Debug.Assert(entity != null);
            System.Diagnostics.Debug.Assert(gameTime != null);

            var lMousePosition = new Vector2(this.InputState.CurrentMouseState.X, this.InputState.CurrentMouseState.Y);
            var lEntityCenter = this.Position + (entity.Size / 2f);
            const float lcOffset = 10;

            var lSpeed = this.Velocity.Length();
            var lDirection = lMousePosition - lEntityCenter;

            if ((Math.Abs(lDirection.X) < lcOffset) && (Math.Abs(lDirection.Y) < lcOffset))
            {
                return;
            }

            var lNewVelocity = lDirection;
            lNewVelocity.Normalize();
            lNewVelocity *= lSpeed;

            this.Acceleration = Vector2.Zero;
            this.Velocity = lNewVelocity;
            this.Position += (float)gameTime.ElapsedGameTime.TotalSeconds * lNewVelocity;
        }

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
    }
}
