using System;
using System.Linq;
using System.Collections.Generic;
using BeeFree2.GameEntities;
using BeeFree2.GameEntities.Movement;
using BeeFree2.GameEntities.Rendering;
using BeeFree2.GameEntities.Shooting;
using BeeFree2.ContentData;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Content;

namespace BeeFree2
{
    /// <summary>
    /// Factory class to create birds.
    /// </summary>
    public class BirdFactory
    {
        /// <summary>
        /// Gets the content manager used by the factory.
        /// </summary>
        public ContentManager ContentManager { get; private set; }

        /// <summary>
        /// Gets or sets the meta data associated with birds.
        /// </summary>
        private IDictionary<int, BirdMetaData> BirdMetaData { get; set; }

        private Action<BulletEntity> BulletFired { get; set; }

        /// <summary>
        /// Gets or sets the BeeEntity which is used for targeting purposes.
        /// </summary>
        private BeeEntity Bee { get; set; }

        /// <summary>
        /// Creates a new bird factory used to create bird entities.
        /// </summary>
        /// <param name="manager"></param>
        public BirdFactory(ContentManager manager, Action<BulletEntity> bulletFired, BeeEntity bee)
        {
            this.ContentManager = manager;
            this.BulletFired = bulletFired;
            this.Bee = bee;
        }

        private Texture2D TextureBody { get; set; }
        private Texture2D TextureEyelids { get; set; }
        private Texture2D TextureFace { get; set; }
        private Texture2D TextureHead { get; set; }
        private Texture2D TextureLegs { get; set; }

        /// <summary>
        /// Creates a new bird using the given bird data.
        /// </summary>
        /// <param name="birdData">The variable information associated with bird starting position and time.</param>
        /// <returns>The new bird entity.</returns>
        public BirdEntity CreateBird(BirdData birdData)
        {
            if (this.BirdMetaData == null)
            {
                this.Initialize();
            }

            var lMetaData = this.BirdMetaData[birdData.Type];

            return new BirdEntity
            {
                MovementBehavior = GetMovementBehavior(birdData, lMetaData),
                Renderer = this.CreateBirdRenderer(lMetaData),
                ShootingBehavior = this.GetShootingBehavior(birdData, lMetaData),
                MaximumHealth = lMetaData.Health,
                CurrentHealth = lMetaData.Health,
                ReleaseTime = birdData.ReleaseTime,
                Damage = lMetaData.TouchDamage,
            };
        }

        /// <summary>
        /// Initializes our meta data.
        /// </summary>
        private void Initialize()
        {
            var lData = this.ContentManager.Load<IEnumerable<BirdMetaData>>("BirdTypes");
            this.BirdMetaData = lData.ToDictionary(x => x.ID, x => x);

            this.TextureBody = this.ContentManager.Load<Texture2D>("sprites/bird_body");
            this.TextureFace = this.ContentManager.Load<Texture2D>("sprites/bird_face");
            this.TextureLegs = this.ContentManager.Load<Texture2D>("sprites/bird_legs");
            this.TextureHead = this.ContentManager.Load<Texture2D>("sprites/bird_head");
            this.TextureEyelids = this.ContentManager.Load<Texture2D>("sprites/bird_eyelids");
        }

        private IShootingBehavior GetShootingBehavior(BirdData data, BirdMetaData metaData)
        {
            switch (metaData.ShootingBehaviorType)
            {
                case "Passive":
                    return new PassiveShooting();

                case "SingleBullet":
                    return new SingleBulletShooting
                    {
                        BulletDamage = int.Parse(metaData.ShootingBehaviorProperties["BulletDamage"]),
                        BulletDirection = new Vector2(float.Parse(metaData.ShootingBehaviorProperties["BulletDirectionX"]), float.Parse(metaData.ShootingBehaviorProperties["BulletDirectionY"])),
                        BulletSpeed = float.Parse(metaData.ShootingBehaviorProperties["BulletSpeed"]),
                        BulletTexture = this.ContentManager.Load<Texture2D>(metaData.ShootingBehaviorProperties["TexturePath"]),
                        FireRate = TimeSpan.FromSeconds(double.Parse(metaData.ShootingBehaviorProperties["FireRate"])),
                        FireBullet = this.BulletFired,
                    };

                case "DoubleBullet":
                    return new DoubleBulletShooting
                    {
                        BulletDamage = int.Parse(metaData.ShootingBehaviorProperties["BulletDamage"]),
                        BulletDirection = new Vector2(float.Parse(metaData.ShootingBehaviorProperties["BulletDirectionX"]), float.Parse(metaData.ShootingBehaviorProperties["BulletDirectionY"])),
                        BulletSpeed = float.Parse(metaData.ShootingBehaviorProperties["BulletSpeed"]),
                        BulletTexture = this.ContentManager.Load<Texture2D>(metaData.ShootingBehaviorProperties["TexturePath"]),
                        FireRate = TimeSpan.FromSeconds(double.Parse(metaData.ShootingBehaviorProperties["FireRate"])),
                        FireBullet = this.BulletFired,
                        Spread = float.Parse(metaData.ShootingBehaviorProperties["Spread"]),
                    };

                case "TripleBullet":
                    return new TripleBulletShooting
                    {
                        BulletDamage = int.Parse(metaData.ShootingBehaviorProperties["BulletDamage"]),
                        BulletDirection = new Vector2(float.Parse(metaData.ShootingBehaviorProperties["BulletDirectionX"]), float.Parse(metaData.ShootingBehaviorProperties["BulletDirectionY"])),
                        BulletSpeed = float.Parse(metaData.ShootingBehaviorProperties["BulletSpeed"]),
                        BulletTexture = this.ContentManager.Load<Texture2D>(metaData.ShootingBehaviorProperties["TexturePath"]),
                        FireRate = TimeSpan.FromSeconds(double.Parse(metaData.ShootingBehaviorProperties["FireRate"])),
                        FireBullet = this.BulletFired,
                        Spread = float.Parse(metaData.ShootingBehaviorProperties["Spread"]),
                    };

                case "Tracking":
                    return new TrackingShooting
                    {
                        BulletDamage = int.Parse(metaData.ShootingBehaviorProperties["BulletDamage"]),
                        BulletDirection = new Vector2(float.Parse(metaData.ShootingBehaviorProperties["BulletDirectionX"]), float.Parse(metaData.ShootingBehaviorProperties["BulletDirectionY"])),
                        BulletSpeed = float.Parse(metaData.ShootingBehaviorProperties["BulletSpeed"]),
                        BulletTexture = this.ContentManager.Load<Texture2D>(metaData.ShootingBehaviorProperties["TexturePath"]),
                        FireRate = TimeSpan.FromSeconds(double.Parse(metaData.ShootingBehaviorProperties["FireRate"])),
                        FireBullet = this.BulletFired,
                        TargetAtraction = float.Parse(metaData.ShootingBehaviorProperties["TargetAtraction"]),
                        TargetEntity = this.Bee,
                    };

                default: throw new ArgumentException();
            }
        }

        private IMovementBehavior GetMovementBehavior(BirdData data, BirdMetaData metaData)
        {
            switch (metaData.MovementBehaviorType)
            {
                case "Straight":
                    return new StraightMovementBehavior
                    {
                        Position = data.Position,
                        Velocity = new Vector2(float.Parse(metaData.MovementBehaviorProperties["VelocityX"]), float.Parse(metaData.MovementBehaviorProperties["VelocityY"])),
                        Acceleration = new Vector2(float.Parse(metaData.MovementBehaviorProperties["AccelerationX"]), float.Parse(metaData.MovementBehaviorProperties["AccelerationY"])),
                    };

                case "Wavey":
                    return new WaveyMovementBehavior
                    {
                        Position = data.Position,
                        Velocity = new Vector2(float.Parse(metaData.MovementBehaviorProperties["VelocityX"]), float.Parse(metaData.MovementBehaviorProperties["VelocityY"])),
                        Acceleration = new Vector2(float.Parse(metaData.MovementBehaviorProperties["AccelerationX"]), float.Parse(metaData.MovementBehaviorProperties["AccelerationY"])),
                        Period = TimeSpan.FromSeconds(float.Parse(metaData.MovementBehaviorProperties["Period"])),
                        Radius = new Vector2(float.Parse(metaData.MovementBehaviorProperties["RadiusX"]), float.Parse(metaData.MovementBehaviorProperties["RadiusY"])),
                    };

                case "Gravity":
                    return new GravityMovementBehavior
                    {
                        Position = data.Position,
                        Velocity = new Vector2(float.Parse(metaData.MovementBehaviorProperties["VelocityX"]), float.Parse(metaData.MovementBehaviorProperties["VelocityY"])),
                        Acceleration = new Vector2(float.Parse(metaData.MovementBehaviorProperties["AccelerationX"]), float.Parse(metaData.MovementBehaviorProperties["AccelerationY"])),
                        TargetEntity = this.Bee,
                    };

                default: throw new ArgumentException();
            }
        }

        private IRenderer CreateBirdRenderer(BirdMetaData metaData)
        {
            return new CompositeRenderer(
                new[] 
                {
                    new CompositeRendererItem(this.TextureLegs, new Vector2(17, 36)),
                    new CompositeRendererItem(this.TextureBody, new Vector2(9, 0), metaData.BodyColor),
                    new CompositeRendererItem(this.TextureHead, new Vector2(5, 10), metaData.HeadColor),
                    new CompositeRendererItem(this.TextureFace, new Vector2(0, 15)),
                    new CompositeRendererItem(this.TextureEyelids, new Vector2(17, 39), metaData.BodyColor),
                });
        }
    }
}
