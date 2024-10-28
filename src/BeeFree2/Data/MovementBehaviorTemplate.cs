using BeeFree2.GameEntities.Movement;
using BeeFree2.GameEntities.Shooting;
using SharpDX.MediaFoundation;
using System;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace BeeFree2.ContentData
{
    public sealed class MovementBehaviorTemplate
    {
        public MovementBehaviorTemplate_Straight Straight { get; set; }

        public IMovementBehavior CreateBehavior(BirdInitializationData birdData)
        {
            if (this.Straight != null) return this.Straight.CreateBehavior(birdData);

            //switch (metaData.MovementBehaviorType)
            //{
            //    case "Straight":
            //        return new StraightMovementBehavior
            //        {
            //            Position = data.Position,
            //            Velocity = new Vector2(float.Parse(metaData.MovementBehaviorProperties["VelocityX"]), float.Parse(metaData.MovementBehaviorProperties["VelocityY"])),
            //            Acceleration = new Vector2(float.Parse(metaData.MovementBehaviorProperties["AccelerationX"]), float.Parse(metaData.MovementBehaviorProperties["AccelerationY"])),
            //        };

            //    case "Wavey":
            //        return new WaveyMovementBehavior
            //        {
            //            Position = data.Position,
            //            Velocity = new Vector2(float.Parse(metaData.MovementBehaviorProperties["VelocityX"]), float.Parse(metaData.MovementBehaviorProperties["VelocityY"])),
            //            Acceleration = new Vector2(float.Parse(metaData.MovementBehaviorProperties["AccelerationX"]), float.Parse(metaData.MovementBehaviorProperties["AccelerationY"])),
            //            Period = TimeSpan.FromSeconds(float.Parse(metaData.MovementBehaviorProperties["Period"])),
            //            Radius = new Vector2(float.Parse(metaData.MovementBehaviorProperties["RadiusX"]), float.Parse(metaData.MovementBehaviorProperties["RadiusY"])),
            //        };

            //    case "Gravity":
            //        return new GravityMovementBehavior
            //        {
            //            Position = data.Position,
            //            Velocity = new Vector2(float.Parse(metaData.MovementBehaviorProperties["VelocityX"]), float.Parse(metaData.MovementBehaviorProperties["VelocityY"])),
            //            Acceleration = new Vector2(float.Parse(metaData.MovementBehaviorProperties["AccelerationX"]), float.Parse(metaData.MovementBehaviorProperties["AccelerationY"])),
            //            TargetEntity = this.Bee,
            //        };

            //    default: throw new ArgumentException();
            //}

            throw new Exception("No defined movement hebavior template.");
        }
    }
}
