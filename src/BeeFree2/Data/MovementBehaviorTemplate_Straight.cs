using BeeFree2.GameEntities.Movement;
using Microsoft.Xna.Framework;
using SharpDX.MediaFoundation;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace BeeFree2.ContentData
{
    public sealed class MovementBehaviorTemplate_Straight
    {
        public Vector2 Velocity { get; set; }

        public Vector2 Acceleration { get; set; }

        public IMovementBehavior CreateBehavior(BirdInitializationData birdData)
        {
            return new StraightMovementBehavior
            {
                Position = birdData.Position,
                Velocity = this.Velocity,
                Acceleration = this.Acceleration,
            };
        }
    }
}
