using System;
using Microsoft.Xna.Framework;
using BeeFree2.EntityManagers;

namespace BeeFree2.GameEntities.ShootingBehaviors
{
    class NormalShooting : IShootingBehavior
    {
        private BulletManager BulletManager { get; set; }

        private TimeSpan FireRate { get; set; }
        private TimeSpan LastShot { get; set; }

        public NormalShooting(BulletManager bulletManager)
        {
            this.FireRate = TimeSpan.FromSeconds(1);
        }

        public void FireWhenReady(GameTime gameTime, Vector2 location)
        {
            if (gameTime.TotalGameTime > this.LastShot + this.FireRate)
            {
                this.LastShot = gameTime.TotalGameTime;
                this.BulletManager.ShootBullet(location, new Vector2(-1, 0), 300);
            }
        }
    }
}
