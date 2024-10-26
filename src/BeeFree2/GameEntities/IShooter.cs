using System;
using Microsoft.Xna.Framework;

namespace BeeFree2.GameEntities
{
    interface IShooter
    {
        Vector2 Location { get; set; }
        Vector2 Size { get; set; }
    }
}
