using System;
using Microsoft.Xna.Framework;

namespace BeeFree2.GameEntities
{
    interface IMovable
    {
        Vector2 Location { get; set; }
        Vector2 Size { get; set; }
        int Speed { get; set; }
    }
}
