using System;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using BeeFree2.EntityManagers;
using BeeFree2.GameEntities.Movement;
using BeeFree2.GameEntities.Rendering;

namespace BeeFree2.GameEntities.Shooting
{
    /// <summary>
    /// This shooter shoots bullets which are attracted to a target entity.
    /// </summary>
    public class TrackingShooting : IShootingBehavior
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

        /// <summary>
        /// Gets or sets the amount the fired bullets are attracted to the target.
        /// </summary>
        public float TargetAtraction { get; set; }

        /// <summary>
        /// Gets or sets the entity which the bullets are attracted to.
        /// </summary>
        public IMovableEntity TargetEntity { get; set; }

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

                var lBullet = new BulletEntity
                {
                    Damage = this.BulletDamage,
                    Renderer = new BasicRenderer(this.BulletTexture),
                    MovementBehavior = new GravityMovementBehavior
                    {
                        Acceleration = Vector2.UnitX * this.TargetAtraction,
                        Velocity = Vector2.Normalize(this.BulletDirection) * this.BulletSpeed,
                        Position = entity.Position + (entity.Size / 2f),
                        TargetEntity = this.TargetEntity,
                    },
                    IsFriendly = entity.IsFriendly,
                };

                this.FireBullet(lBullet);
            }
        }

        /// <summary>
        /// Gets or sets the action called when a new bullet should be fired.
        /// </summary>
        public Action<BulletEntity> FireBullet { get; set; }
    }
}
