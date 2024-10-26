using System;
using Microsoft.Xna.Framework;

namespace BeeFree2.ContentData
{
    public sealed class BirdInitializationData
    {
        public int Type { get; set; }
        public TimeSpan ReleaseTime { get; set; }
        public Vector2 Position { get; set; }
    }
}
