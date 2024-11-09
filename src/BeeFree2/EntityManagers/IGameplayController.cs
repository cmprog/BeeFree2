using BeeFree2.GameEntities;
using Microsoft.Xna.Framework;
using System;

namespace BeeFree2.EntityManagers
{
    /// <summary>
    /// Defines the interface needed by the <see cref="IGameplayProvider"/> to
    /// control various aspects of the gameplay.
    /// </summary>
    public interface IGameplayController
    {
        Game Game { get; }

        string LevelName { get; set; }

        int BirdsKilled { get; set; }

        int HoneycombCollected { get; set; }

        public TimeSpan? TimeRemaining { get; set; }

        void AddBird(BirdEntity birdEntity);

        void OnLevelComplete();
    }
}
