using BeeFree2.Config;
using BeeFree2.GameEntities;
using Microsoft.Xna.Framework;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BeeFree2.EntityManagers
{
    /// <summary>
    /// Implements the <see cref="IGameplayProvider"/> using a configured level template.
    /// </summary>
    public sealed class StandardGameplayProvider : IGameplayProvider
    {
        private readonly IGameplayController mGameplayController;

        private readonly TimeSpan mLevelDuration;
        private TimeSpan mTotalElapsedTime;

        private readonly List<BirdEntity> mBirdEntities;
        private TimeSpan mLastReleaseTime;
        private int mNextBirdIndex;

        public StandardGameplayProvider(IGameplayController gameplayController, int levelId)
        {
            this.mGameplayController = gameplayController;
            this.mGameplayController.LevelName = $"Level {(levelId + 1):N0}";

            var lConfigManager = gameplayController.Game.Services.GetService<ConfigurationManager>();
            var lLevelData = lConfigManager.LoadLevelData(levelId);

            this.mLevelDuration = lLevelData.EndTime - lLevelData.StartTime;

            var lBirdFactory = new BirdFactory(gameplayController);
            this.mBirdEntities = lLevelData.Birds.Select(x => lBirdFactory.CreateBird(x)).ToList();
            this.mNextBirdIndex = 0;
        }

        public void Update(GameTime gameTime)
        {
            if (this.mLastReleaseTime == default)
            {
                this.mLastReleaseTime = gameTime.TotalGameTime;
            }

            while (this.CanReleaseBird(gameTime, out var lBird))
            {
                this.mGameplayController.AddBird(lBird);

                this.mNextBirdIndex++;
                this.mLastReleaseTime = gameTime.TotalGameTime;
            }

            this.mTotalElapsedTime += gameTime.ElapsedGameTime;
            
            if (this.mTotalElapsedTime > this.mLevelDuration)
            {
                this.mGameplayController.TimeRemaining = TimeSpan.Zero;
                this.mGameplayController.OnLevelComplete();
            }
            else
            {
                this.mGameplayController.TimeRemaining = this.mLevelDuration - this.mTotalElapsedTime;
            }
        }

        private bool CanReleaseBird(GameTime gameTime, out BirdEntity bird)
        {
            if (this.mNextBirdIndex >= this.mBirdEntities.Count)
            {
                bird = default;
                return false;
            }

            var lTimeSinceLastRelease = gameTime.TotalGameTime - this.mLastReleaseTime;

            var lCandidateBirdEntity = this.mBirdEntities[this.mNextBirdIndex];
            if (lCandidateBirdEntity.ReleaseTime > lTimeSinceLastRelease)
            {
                bird = default;
                return false;
            }

            bird = lCandidateBirdEntity;
            return true;
        }
    }
}
