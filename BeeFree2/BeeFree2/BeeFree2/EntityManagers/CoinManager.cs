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
using BeeFree2.GameEntities.Rendering;

namespace BeeFree2.EntityManagers
{
    /// <summary>
    /// This class manages all the coins on the screen.
    /// </summary>
    internal class CoinManager : EntityManager
    {
        /// <summary>
        /// The Texture2D to use for coins.
        /// </summary>
        private Texture2D Texture { get; set; }

        /// <summary>
        /// Gets or sets the collection of active coins.
        /// </summary>
        private HashSet<SimpleGameEntity> Coins { get; set; }

        /// <summary>
        /// Gets an enumerable collection of all active coins.
        /// </summary>
        public IEnumerable<SimpleGameEntity> ActiveCoins { get { return this.Coins; } }

        public CoinManager()
        {
            this.Coins = new HashSet<SimpleGameEntity>();
        }

        /// <summary>
        /// Adds a new active coin.
        /// </summary>
        /// <param name="coin">The coin to add.</param>
        public void Add(SimpleGameEntity coin)
        {
            coin.Renderer = new BasicRenderer(this.Texture);
            this.Coins.Add(coin);
        }

        /// <summary>
        /// Removes the given coin from the collection of active coins.
        /// </summary>
        /// <param name="coin">The coin to remove.</param>
        public void Remove(SimpleGameEntity coin)
        {
            this.Coins.Remove(coin);
        }

        public override void Activate(Game game)
        {
            base.Activate(game);

            this.Texture = this.ContentManager.Load<Texture2D>("sprites/honeycomb");
        }

        /// <summary>
        /// Updates all the coins by allowing them to move.
        /// </summary>
        /// <param name="gameTime">The current game time.</param>
        public void Update(GameTime gameTime)
        {
            const float lcCoinPadding = 10;

            using (var lDeadCoins = new BatchCollectionRemover<SimpleGameEntity>(this.Coins))
            {
                foreach (var lCoin in this.Coins)
                {
                    lCoin.MovementBehavior.Move(lCoin, gameTime);

                    if ((lCoin.Position.X < lcCoinPadding) ||
                        (lCoin.Position.Y < lcCoinPadding) ||
                        (lCoin.Position.X + lCoin.Size.X > this.ScreenSize.X + lcCoinPadding) ||
                        (lCoin.Position.Y + lCoin.Size.Y > this.ScreenSize.Y + lcCoinPadding))
                    {
                        lDeadCoins.Add(lCoin);
                    }
                }
            }
        }

        /// <summary>
        /// Draws all the coins on the screen.
        /// </summary>
        /// <param name="spriteBatch">The SpriteBatch to draw the bullets with.</param>
        /// <param name="gameTime">The current game time.</param>
        public void Draw(SpriteBatch spriteBatch, GameTime gameTime)
        {
            foreach (var lCoin in this.ActiveCoins)
            {
                lCoin.Renderer.Render(lCoin, spriteBatch, gameTime);
            }
        }
    }
}
