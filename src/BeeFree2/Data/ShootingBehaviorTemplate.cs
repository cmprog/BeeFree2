using BeeFree2.GameEntities.Shooting;
using System;

namespace BeeFree2.ContentData
{
    public sealed class ShootingBehaviorTemplate
    {
        public ShootingBehaviorTemplate_Passive Passive { get; set; }

        public IShootingBehavior CreateBehavior()
        {
            if (this.Passive != null) return this.Passive.CreateBehavior();

            //switch (metaData.ShootingBehaviorType)
            //{
            //    case "Passive":
            //        return new PassiveShooting();

            //    case "SingleBullet":
            //        return new SingleBulletShooting
            //        {
            //            BulletDamage = int.Parse(metaData.ShootingBehaviorProperties["BulletDamage"]),
            //            BulletDirection = new Vector2(float.Parse(metaData.ShootingBehaviorProperties["BulletDirectionX"]), float.Parse(metaData.ShootingBehaviorProperties["BulletDirectionY"])),
            //            BulletSpeed = float.Parse(metaData.ShootingBehaviorProperties["BulletSpeed"]),
            //            BulletTexture = this.ContentManager.Load<Texture2D>(metaData.ShootingBehaviorProperties["TexturePath"]),
            //            FireRate = TimeSpan.FromSeconds(double.Parse(metaData.ShootingBehaviorProperties["FireRate"])),
            //            FireBullet = this.BulletFired,
            //        };

            //    case "DoubleBullet":
            //        return new DoubleBulletShooting
            //        {
            //            BulletDamage = int.Parse(metaData.ShootingBehaviorProperties["BulletDamage"]),
            //            BulletDirection = new Vector2(float.Parse(metaData.ShootingBehaviorProperties["BulletDirectionX"]), float.Parse(metaData.ShootingBehaviorProperties["BulletDirectionY"])),
            //            BulletSpeed = float.Parse(metaData.ShootingBehaviorProperties["BulletSpeed"]),
            //            BulletTexture = this.ContentManager.Load<Texture2D>(metaData.ShootingBehaviorProperties["TexturePath"]),
            //            FireRate = TimeSpan.FromSeconds(double.Parse(metaData.ShootingBehaviorProperties["FireRate"])),
            //            FireBullet = this.BulletFired,
            //            Spread = float.Parse(metaData.ShootingBehaviorProperties["Spread"]),
            //        };

            //    case "TripleBullet":
            //        return new TripleBulletShooting
            //        {
            //            BulletDamage = int.Parse(metaData.ShootingBehaviorProperties["BulletDamage"]),
            //            BulletDirection = new Vector2(float.Parse(metaData.ShootingBehaviorProperties["BulletDirectionX"]), float.Parse(metaData.ShootingBehaviorProperties["BulletDirectionY"])),
            //            BulletSpeed = float.Parse(metaData.ShootingBehaviorProperties["BulletSpeed"]),
            //            BulletTexture = this.ContentManager.Load<Texture2D>(metaData.ShootingBehaviorProperties["TexturePath"]),
            //            FireRate = TimeSpan.FromSeconds(double.Parse(metaData.ShootingBehaviorProperties["FireRate"])),
            //            FireBullet = this.BulletFired,
            //            Spread = float.Parse(metaData.ShootingBehaviorProperties["Spread"]),
            //        };

            //    case "Tracking":
            //        return new TrackingShooting
            //        {
            //            BulletDamage = int.Parse(metaData.ShootingBehaviorProperties["BulletDamage"]),
            //            BulletDirection = new Vector2(float.Parse(metaData.ShootingBehaviorProperties["BulletDirectionX"]), float.Parse(metaData.ShootingBehaviorProperties["BulletDirectionY"])),
            //            BulletSpeed = float.Parse(metaData.ShootingBehaviorProperties["BulletSpeed"]),
            //            BulletTexture = this.ContentManager.Load<Texture2D>(metaData.ShootingBehaviorProperties["TexturePath"]),
            //            FireRate = TimeSpan.FromSeconds(double.Parse(metaData.ShootingBehaviorProperties["FireRate"])),
            //            FireBullet = this.BulletFired,
            //            TargetAtraction = float.Parse(metaData.ShootingBehaviorProperties["TargetAtraction"]),
            //            TargetEntity = this.Bee,
            //        };

            //    default: throw new ArgumentException();
            //}

            throw new Exception("No defined shooting hebavior template.");
        }
    }
}
