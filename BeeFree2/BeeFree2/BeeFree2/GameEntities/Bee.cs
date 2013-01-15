using System;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;

namespace BeeFree2.GameEntities
{
    class Bee : GameEntity
    {
        private Texture2D[] mBeeTextures;
        private Texture2D mCurrentTexture;
        private int mCurrentTextureIndex;
        private bool mIncrementIndex;

        /// <summary>
        /// Gets and sets the TimeSpan between when the bee can fire stingers.
        /// </summary>
        public TimeSpan FireRate { get; set; }

        /// <summary>
        /// Gets and sets the speed (pixels / second) at which the bee moves.
        /// </summary>
        public int Speed { get; set; }

        /// <summary>
        /// Gets the current health of the bee.
        /// </summary>
        public int Health { get; set; }

        /// <summary>
        /// Gets the maximum health of the bee.
        /// </summary>
        public int MaxHealth { get; set; }

        /// <summary>
        /// Gets the rate the bee heals itself (in Health/second)
        /// </summary>
        public int HealthRegenRate { get; set; }

        /// <summary>
        /// Gets and sets the damage done by the bee when shooting.
        /// </summary>
        public int Damage { get; set; }

        /// <summary>
        /// Gets and sets the number of stingers fired when shooting.
        /// </summary>
        public int StingerCount { get; set; }

        public Bee()
        {
            this.Speed = 200;
        }

        public void Move(Vector2 direction, float seconds)
        {
            direction.Normalize();

            this.Location =
                Vector2.Clamp(
                    this.Location + (direction * seconds * this.Speed),
                    Vector2.Zero, this.ScreenSize - this.Size);
        }

        public override void LoadContent(ContentManager content)
        {
            this.mBeeTextures = new[]
            {
                content.Load<Texture2D>("sprites/bee1"),
                content.Load<Texture2D>("sprites/bee2"),
                content.Load<Texture2D>("sprites/bee3"),
                content.Load<Texture2D>("sprites/bee4"),
                content.Load<Texture2D>("sprites/bee5"),
            };

            this.mCurrentTextureIndex = 0;
            this.mIncrementIndex = true;
            this.mCurrentTexture = this.mBeeTextures[0];
            this.Size = new Vector2(this.mCurrentTexture.Width, this.mCurrentTexture.Height);
        }

        public override void Update(GameTime gameTime)
        {
        }

        public override void Draw(SpriteBatch spriteBatch)
        {
            this.mCurrentTexture = this.mBeeTextures[this.mCurrentTextureIndex];

            spriteBatch.Draw(this.mCurrentTexture, this.Bounds, Color.White);

            if (this.mIncrementIndex)
            {
                this.mCurrentTextureIndex++;
                if (this.mCurrentTextureIndex == this.mBeeTextures.Length - 1) this.mIncrementIndex = !this.mIncrementIndex;
            }
            else
            {
                this.mCurrentTextureIndex--;
                if (this.mCurrentTextureIndex == 0) this.mIncrementIndex = !this.mIncrementIndex;
            }
        }
    }
}
