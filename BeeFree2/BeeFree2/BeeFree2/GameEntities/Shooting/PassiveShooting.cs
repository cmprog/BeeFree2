using System;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using BeeFree2.EntityManagers;

namespace BeeFree2.GameEntities.Shooting
{
    /// <summary>
    /// Passive shooting is actually no shooting at all!
    /// </summary>
    internal class PassiveShooting : IShootingBehavior
    {
        /// <summary>
        ///  Gets or sets the texture to use for the bullets.
        /// </summary>
        public Texture2D BulletTexture { get; set; }

        /// <summary>
        /// Gets or sets the time between shots fired.
        /// </summary>
        public TimeSpan FireRate { get; set; }

        /// <summary>
        /// Gets or sets the speed of new bullets.
        /// </summary>
        public float BulletSpeed { get; set; }

        /// <summary>
        /// Gets or sets the damage of the bullets.
        /// </summary>
        public int BulletDamage { get; set; }

        /// <summary>
        /// This will never fire a bullet.
        /// </summary>
        /// <param name="entity">The source entity shooting.</param>
        /// <param name="gameTime">The elapsed game time.</param>
        /// <param name="bulletManager">A bullet manager to shoot bullets with.</param>
        public void FireWhenReady(IShootingEntity entity, GameTime gameTime)
        {
        }

        /// <summary>
        /// Gets or sets the action called when a new bullet should be fired.
        /// </summary>
        public Action<BulletEntity> FireBullet { get; set; }
    }
}
