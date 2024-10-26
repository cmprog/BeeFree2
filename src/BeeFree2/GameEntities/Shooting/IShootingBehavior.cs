using System;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using BeeFree2.EntityManagers;

namespace BeeFree2.GameEntities.Shooting
{
    /// <summary>
    /// Defines an interface for a method of shooting things.
    /// </summary>
    public interface IShootingBehavior
    {
        /// <summary>
        ///  Gets or sets the texture to use for the bullets.
        /// </summary>
        Texture2D BulletTexture { get; set; }

        /// <summary>
        /// Gets or sets the time between shots fired.
        /// </summary>
        TimeSpan FireRate { get; set; }

        /// <summary>
        /// Gets or sets the speed of new bullets.
        /// </summary>
        float BulletSpeed { get; set; }

        /// <summary>
        /// Gets or sets the damage of the bullets.
        /// </summary>
        int BulletDamage { get; set; }

        /// <summary>
        /// Fires a bullet for the entity if based on the behavior.
        /// </summary>
        /// <param name="entity">The source entity shooting.</param>
        /// <param name="gameTime">The elapsed game time.</param>
        /// <param name="bulletManager">A bullet manager to shoot bullets with.</param>
        void FireWhenReady(IShootingEntity entity, GameTime gameTime);

        /// <summary>
        /// Gets or sets the action which is called when a bullet should be fired.
        /// </summary>
        Action<BulletEntity> FireBullet { get; set; }
    }
}
