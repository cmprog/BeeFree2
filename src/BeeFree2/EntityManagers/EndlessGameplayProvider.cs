using BeeFree2.ContentData;
using Microsoft.Xna.Framework;
using System;

namespace BeeFree2.EntityManagers
{
    /// <summary>
    /// Implements the <see cref="IGameplayProvider"/> in 'endless' mode.
    /// </summary>
    public sealed class EndlessGameplayProvider : IGameplayProvider
    {
        private readonly IGameplayController mGameplayController;
        private readonly BirdFactory mBirdFactory;
        private readonly Random mRand = new();

        private TimeSpan mNextReleaseTime;
        private TimeSpan mSpawnPeriod = TimeSpan.FromSeconds(2);
        private TimeSpan mSpawnPeriodMin = TimeSpan.FromSeconds(0.05);

        public EndlessGameplayProvider(IGameplayController gameplayController)
        {
            this.mGameplayController = gameplayController;
            this.mGameplayController.LevelName = "Endless";

            this.mBirdFactory = new BirdFactory(gameplayController);
        }

        public void Update(GameTime gameTime)
        {
            if (this.mNextReleaseTime == default)
            {
                this.mNextReleaseTime = gameTime.TotalGameTime + TimeSpan.FromSeconds(1);
            }

            while (gameTime.TotalGameTime > this.mNextReleaseTime)
            {
                var lGraphicsDevice = this.mGameplayController.Game.GraphicsDevice;
                var lScreenWidth = lGraphicsDevice.PresentationParameters.BackBufferWidth;
                var lScreenHeight = lGraphicsDevice.PresentationParameters.BackBufferHeight;
                
                // Dummy offset so the birds start offscreen.
                const int lcBirdScreenOffset = 100;

                var lBirdPositionX = lScreenWidth + lcBirdScreenOffset;
                var lBirdPositionY = this.mRand.NextSingle() * lScreenHeight;

                var lInitializationData = new BirdInitializationData();
                lInitializationData.Type = 0;
                lInitializationData.Position = new Vector2(lBirdPositionX, lBirdPositionY);

                var lBirdEntity = this.mBirdFactory.CreateBird(lInitializationData);

                this.mGameplayController.AddBird(lBirdEntity);

                this.mNextReleaseTime += this.mSpawnPeriod;
                this.mSpawnPeriod = TimeSpan.FromTicks(Math.Max(this.mSpawnPeriodMin.Ticks, (int)(this.mSpawnPeriod.Ticks * 0.95)));
            }
        }
    }
}
