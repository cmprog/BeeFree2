using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using TccLib.Xna.GameStateManagement;
using BeeFree2.GameEntities;

namespace BeeFree2.EntityManagers
{
    /// <summary>
    /// This class manages all the bullets on the screen.
    /// </summary>
    internal class BulletManager : EntityManager
    {
        /// <summary>
        /// Gets or sets the collection of active bullets.
        /// </summary>
        private HashSet<BulletEntity> Bullets { get; set; }

        /// <summary>
        /// Gets an enumerable collection of all active bullets.
        /// </summary>
        public IEnumerable<BulletEntity> ActiveBullets { get { return this.Bullets; } }

        /// <summary>
        /// Creates a new bullet manager.
        /// </summary>
        public BulletManager()
        {
            this.Bullets = new HashSet<BulletEntity>();
        }

        /// <summary>
        /// Adds a new active bullet.
        /// </summary>
        /// <param name="bullet"></param>
        public void Add(BulletEntity bullet)
        {
            this.Bullets.Add(bullet);
        }

        /// <summary>
        /// Removes the given bullet from the collection of active bullets.
        /// </summary>
        /// <param name="bullet">The bullet to remove.</param>
        public void Remove(BulletEntity bullet)
        {
            this.Bullets.Remove(bullet);
        }

        /// <summary>
        /// Updates all the bullets by allowing them to move.
        /// </summary>
        /// <param name="gameTime">The current game time.</param>
        public void Update(GameTime gameTime)
        {
            const float lcBulletPadding = 50;

            using (var lDeadBullets = new BatchCollectionRemover<BulletEntity>(this.Bullets))
            {
                foreach (var lBullet in this.Bullets)
                {
                    lBullet.MovementBehavior.Move(lBullet, gameTime);

                    if ((lBullet.Position.X < -lcBulletPadding) ||
                        (lBullet.Position.Y < -lcBulletPadding) ||
                        (lBullet.Position.X + lBullet.Size.X > this.ScreenSize.X + lcBulletPadding) ||
                        (lBullet.Position.Y + lBullet.Size.Y > this.ScreenSize.Y + lcBulletPadding))
                    {
                        lDeadBullets.Add(lBullet);
                    }
                }
            }
        }

        /// <summary>
        /// Draws all the active bullets on the screen using the given SpriteBatch.
        /// </summary>
        /// <param name="spriteBatch">The SpriteBatch to draw the bullets with.</param>
        /// <param name="gameTime">The current game time.</param>
        public void Draw(SpriteBatch spriteBatch, GameTime gameTime)
        {
            foreach (var lBullet in this.ActiveBullets)
            {
                lBullet.Renderer.Render(lBullet, spriteBatch, gameTime);
            }
        }
    }
}
