using System;
using System.Linq;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;

namespace BeeFree2.GameEntities
{
    class Cloud : GameEntity
    {
        private Texture2D[] Textures { get; set; }
        private Texture2D CurrentTexture { get; set; }

        public Random Random { get; set; }

        private int RestartTimer { get; set; }
        private bool RestartTimerActive { get; set; }

        public int Speed { get; set; }
        public  float ScaleFactor { get; private set; }

        private int MaxCloudWith { get; set; }
        
        public override void LoadContent(ContentManager content)
        {
            this.Textures = new[]
            {
                content.Load<Texture2D>("sprites/cloud1"),
                content.Load<Texture2D>("sprites/cloud2"),
                content.Load<Texture2D>("sprites/cloud3"),
            };

            this.MaxCloudWith = this.Textures.Max(x => x.Width);

            this.Reset();

            // We want to start the clouds randomly across X and without a timer.
            this.RestartTimerActive = false;
            this.Location = new Vector2(
                this.Random.Next(-(int)this.Size.X, (int)this.ScreenSize.X),
                this.Location.Y);
        }

        public event EventHandler ScaleChanged;

        private void Reset()
        {
            this.RestartTimerActive = true;
            this.RestartTimer = this.Random.Next(50, 200);

            var lNewLocationY = this.Random.Next(
                -(int)this.Size.Y, 
                (int)(this.ScreenSize.Y - this.Size.Y));
                        
            this.CurrentTexture = this.Textures[this.Random.Next(this.Textures.Length)];
            this.Size = new Vector2(this.CurrentTexture.Width, this.CurrentTexture.Height);
            this.Location = new Vector2(this.ScreenSize.X, lNewLocationY);
            this.Speed = this.Random.Next(50, 200);
            this.ScaleFactor = MathHelper.Lerp(0.2f, 1.0f, (float)Math.Pow(((this.Speed - 50) / 200f), 2));
            this.ScaleChanged.Fire(this);
        }

        public override void Update(GameTime gameTime)
        {
            if (this.RestartTimerActive)
            {
                this.RestartTimer--;
                this.RestartTimerActive = (this.RestartTimer > 0);
            }
            else
            {
                var lSeconds = (float)gameTime.ElapsedGameTime.TotalSeconds;
                this.Location = 
                    new Vector2(
                        this.Location.X - (this.Speed * lSeconds),
                        this.Location.Y);
            }
        }

        public override void Draw(SpriteBatch spriteBatch)
        {
            if (this.Location.X < -MaxCloudWith)
            {
                this.Reset();
            }

            spriteBatch.Draw(this.CurrentTexture, this.Location, null, Color.White, 0, Vector2.Zero, this.ScaleFactor, SpriteEffects.None, 0);
        }
    }
}
