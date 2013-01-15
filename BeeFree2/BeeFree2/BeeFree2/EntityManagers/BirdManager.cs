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
using BeeFree2.GameEntities.Movement;
using BeeFree2.GameEntities.Shooting;

namespace BeeFree2.EntityManagers
{
    /// <summary>
    /// Manages all of the active BirdEntities.
    /// </summary>
    internal class BirdManager : EntityManager
    {
        /// <summary>
        /// Gets or sets the set of birds on the screen.
        /// </summary>
        private HashSet<BirdEntity> Birds { get; set; }

        /// <summary>
        /// Gets an enumerable collection of the active birds on the screen.
        /// </summary>
        public IEnumerable<BirdEntity> ActiveBirds { get { return this.Birds; } }

        /// <summary>
        /// Gets or sets a collection of dead birds.
        /// </summary>
        private ICollection<BirdEntity> DeadBirds { get; set; }

        public BirdManager()
        {
            this.Birds = new HashSet<BirdEntity>();
            this.DeadBirds = new HashSet<BirdEntity>();
        }

        /// <summary>
        /// Adds a new active bird.
        /// </summary>
        /// <param name="bullet"></param>
        public void Add(BirdEntity bird)
        {
            this.Birds.Add(bird);
            bird.OnDeath += this.Bird_OnDeath;
        }

        private void Bird_OnDeath(BirdEntity bird)
        {
            this.DeadBirds.Add(bird);
        }

        /// <summary>
        /// Removes the given bird.
        /// </summary>
        /// <param name="bullet">The bullet to remove.</param>
        public void Remove(BirdEntity bird)
        {
            this.Birds.Remove(bird);
        }

        public void Update(GameTime gameTime)
        {
            const float lcBirdPadding = 50;

            using (var lInactiveBirds = new BatchCollectionRemover<BirdEntity>(this.Birds))
            {
                lInactiveBirds.AddRange(this.DeadBirds);
                this.DeadBirds.Clear();

                foreach (var lBird in this.Birds)
                {
                    lBird.MovementBehavior.Move(lBird, gameTime);

                    if ((lBird.Position.X + lBird.Size.X < -lcBirdPadding) ||
                        (lBird.Position.Y + lBird.Size.Y < -lcBirdPadding) ||
                        (lBird.Position.X > this.ScreenSize.X + lcBirdPadding) ||
                        (lBird.Position.Y > this.ScreenSize.Y + lcBirdPadding))
                    {
                        lInactiveBirds.Add(lBird);
                    }

                    lBird.ShootingBehavior.FireWhenReady(lBird, gameTime);
                }
            }
        }
        
        /// <summary>
        /// Draws all of the birds using the given SpriteBatch.
        /// </summary>
        /// <param name="spriteBatch">The sprite batch used to draw the birds.</param>
        /// <param name="gameTime">The current game time.</param>
        public void Draw(SpriteBatch spriteBatch, GameTime gameTime)
        {
            foreach (var lBird in this.Birds)
            {
                lBird.Renderer.Render(lBird, spriteBatch, gameTime);
            }
        }
    }
}
