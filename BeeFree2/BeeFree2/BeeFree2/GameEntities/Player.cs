using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BeeFree2.GameEntities
{
    [Serializable]
    public class Player
    {
        public Player()
        {
            this.LevelStats = Enumerable.Range(0, 25).Select(x => new LevelData()).ToArray();
        }

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

        public LevelData[] LevelStats { get; set; }

        [Serializable]
        public class LevelData
        {
            public bool IsAvailable { get; set; }
            public bool Completed { get; set; }
            public bool CompletedFlawlessly { get; set; }
            public bool CompletedPerfectly { get; set; }

            public int PlayCount { get; set; }
            public int FailCount { get; set; }
        }
    }
}
