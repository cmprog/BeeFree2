using System;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using BeeFree2.EntityManagers;
using BeeFree2.GameEntities.Movement;
using BeeFree2.GameEntities.Rendering;

namespace BeeFree2.GameEntities.Shooting
{
    /// <summary>
    /// Defines a shooting behaviors which shoots two bullets in front of the shooter.
    /// </summary>
    internal class DoubleBulletShooting : IShootingBehavior
    {
        /// <summary>
        ///  Gets or sets the texture to use for the bullets.
        /// </summary>
        public Texture2D BulletTexture { get; set; }

        /// <summary>
        /// Gets or sets the time of the last shot fired.
        /// </summary>
        private TimeSpan LastShot { get; set; }

        /// <summary>
        /// Gets or sets the time between shots fired.
        /// </summary>
        public TimeSpan FireRate { get; set; }

        /// <summary>
        /// Gets or sets the speed of new bullets.
        /// </summary>
        public float BulletSpeed { get; set; }

        /// <summary>
        /// Gets or sets the diction to fire the bullet.
        /// </summary>
        public Vector2 BulletDirection { get; set; }

        /// <summary>
        /// Gets or sets the damage of the bullets.
        /// </summary>
        public int BulletDamage { get; set; }

        public float Spread { get; set; }

        /// <summary>
        /// Fires a bullet for the entity if based on the behavior.
        /// </summary>
        /// <param name="entity">The source entity shooting.</param>
        /// <param name="gameTime">The elapsed game time.</param>
        /// <param name="bulletManager">A bullet manager to shoot bullets with.</param>
        public void FireWhenReady(IShootingEntity entity, GameTime gameTime)
        {
            if (gameTime.TotalGameTime > this.LastShot + this.FireRate)
            {
                this.LastShot = gameTime.TotalGameTime;

                var lDirectionOffset = MathHelper.ToRadians(this.Spread);
                var lDirection = Math.Atan2(this.BulletDirection.Y, this.BulletDirection.X);
                var lTopDirection = lDirection - lDirectionOffset;
                var lBottomDirection = lDirection + lDirectionOffset;

                var lTopVector = this.BulletSpeed * new Vector2(
                    (float)Math.Cos(lTopDirection),
                    (float)Math.Sin(lTopDirection));

                var lBottomVector = this.BulletSpeed * new Vector2(
                    (float)Math.Cos(lBottomDirection),
                    (float)Math.Sin(lBottomDirection));

                var lBulletTop = new BulletEntity
                {
                    Damage = this.BulletDamage,
                    MovementBehavior = new StraightMovementBehavior
                    {
                        Acceleration = Vector2.Zero,
                        Velocity = lTopVector,
                        Position = entity.Position + (entity.Size / 2f),
                    },
                    Renderer = new BasicRenderer(this.BulletTexture),
                    IsFriendly = entity.IsFriendly,
                };

                var lBulletBottom = new BulletEntity
                {
                    Damage = this.BulletDamage,
                    Renderer = new BasicRenderer(this.BulletTexture),
                    MovementBehavior = new StraightMovementBehavior
                    {
                        Acceleration = Vector2.Zero,
                        Velocity = lBottomVector,
                        Position = entity.Position + (entity.Size / 2f),
                    },
                    IsFriendly = entity.IsFriendly,
                };

                this.FireBullet(lBulletTop);
                this.FireBullet(lBulletBottom);
            }
        }

        /// <summary>
        /// Gets or sets the action called when a new bullet should be fired.
        /// </summary>
        public Action<BulletEntity> FireBullet { get; set; }
    }
}
