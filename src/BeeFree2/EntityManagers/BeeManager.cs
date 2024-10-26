using System;
using System.Collections.Generic;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using BeeFree2.GameEntities;
using BeeFree2.GameEntities.Rendering;

namespace BeeFree2.EntityManagers
{
    /// <summary>
    /// Manager for the Bee entity.
    /// </summary>
    internal class BeeManager : EntityManager
    {
        /// <summary>
        /// The Bee managed by this manager.
        /// </summary>
        public BeeEntity Bee { get; set; }
        
        public override void Activate(Game game)
        {
            base.Activate(game);

            this.Bee.Renderer = 
                new AnimatedRenderer(
                    new List<Texture2D>
                        {
                            this.ContentManager.Load<Texture2D>("sprites/bee1"),
                            this.ContentManager.Load<Texture2D>("sprites/bee2"),
                            this.ContentManager.Load<Texture2D>("sprites/bee3"),
                            this.ContentManager.Load<Texture2D>("sprites/bee4"),
                            this.ContentManager.Load<Texture2D>("sprites/bee5"),
                        });
        }

        /// <summary>
        /// Updates the bee by moving it based on its movement behavior.
        /// </summary>
        /// <param name="gameTime">The GameTime encapsulating elapsed time.</param>
        public void Update(GameTime gameTime)
        {
            this.Bee.CurrentHealth = Math.Min(
                this.Bee.MaximumHealth,
                this.Bee.CurrentHealth + (float)(gameTime.ElapsedGameTime.TotalSeconds * this.Bee.HealthRegen));

            this.Bee.MovementBehavior.Move(this.Bee, gameTime);
            this.Bee.MovementBehavior.Position = Vector2.Clamp(this.Bee.Position, Vector2.Zero, this.ScreenSize - this.Bee.Size);
        }

        public void Draw(SpriteBatch spriteBatch, GameTime gameTime)
        {
            this.Bee.Renderer.Render(this.Bee, spriteBatch, gameTime);
        }
    }
}
