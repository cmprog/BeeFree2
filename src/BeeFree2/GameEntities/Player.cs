using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;

namespace BeeFree2.GameEntities
{
    public sealed class Player
    {
        public Player()
            : this(new SaveSlot())
        {

        }

        [JsonConstructor]
        public Player(SaveSlot saveSlot)
        {
            this.SaveSlot = saveSlot;
            this.CreatedOn = DateTime.UtcNow;

            this.Levels = new Dictionary<int, LevelData>();
        }

        public SaveSlot SaveSlot { get; }

        public DateTime CreatedOn { get; set; }

        public DateTime LastPlayedOn { get; set; }

        public string Name { get; set; }

        public int AvailableHoneycombToSpend { get; set; }
        public int TotalHoneycombCollected { get; set; }

        public int KillCount { get; set; }
        public int DeathCount { get; set; }

        public int BeeSpeed { get; set; }
        public int BeeMaxHealth { get; set; }
        public int BeeHeathRegen { get; set; }
        public int BeeFireRate { get; set; }
        public int BeeDamage { get; set; }
        public int BeeShotCount { get; set; }
        public int BeeHoneycombAttraction { get; set; }
        public int BeeBulletSpeed { get; set; }

        [JsonInclude]
        private Dictionary<int, LevelData> Levels { get; init; }

        public void MarkLevelCompleted(int levelIndex, bool wasFlawlessCompletion, bool wasPerfectCompeltion)
            => this.GetLevelData(levelIndex).MarkComplete(wasFlawlessCompletion, wasPerfectCompeltion);

        public void MarkLevelAvailable(int levelIndex)
            => this.GetLevelData(levelIndex).MarkAvailable();

        public void MarkLevelPlayed(int levelIndex)
            => this.GetLevelData(levelIndex).MarkPlayed();

        [JsonIgnore]
        public int LevelsAvailable => this.Levels.Values.Count(x => x.IsAvailable);
        
        public LevelData GetLevelData(int levelIndex)
        {
            if (!this.Levels.TryGetValue(levelIndex, out var lLevelData))
            {
                lLevelData = new LevelData();
                this.Levels.Add(levelIndex, lLevelData);
            }

            return lLevelData;
        }
    }
}
