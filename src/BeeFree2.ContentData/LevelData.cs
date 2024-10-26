using System;

namespace BeeFree2.ContentData
{
    public class LevelData
    {
        public string Name { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public BirdData[] BirdData { get; set; }
    }
}
