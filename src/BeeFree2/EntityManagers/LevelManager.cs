using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using BeeFree2.GameEntities;
using BeeFree2.GameEntities.Movement;
using BeeFree2.GameEntities.Shooting;
using BeeFree2.ContentData;

namespace BeeFree2.EntityManagers
{
    class LevelManager : EntityManager
    {
        private IShootingBehavior[] ShootingBehaviors { get; set; }
        private IMovementBehavior[] MovementBehaviors { get; set; }
        
        private Texture2D TextureBody { get; set; }
        private Texture2D TextureEyelids { get; set; }
        private Texture2D TextureFace { get; set; }
        private Texture2D TextureHead { get; set; }
        private Texture2D TextureLegs { get; set; }

        private Random Random { get; set; }

        private int CurrentLevel { get; set; }
        private int CurrentBirdIndex { get; set; }
        private TimeSpan LastRelease { get; set; }
        private TimeSpan ElapsedTime { get; set; }

        /// <summary>
        /// Gets the total number of birds in the level.
        /// </summary>
        public int TotalBirdCount { get; private set; }

        /// <summary>
        /// Gets or sets a list of birds for this level.
        /// </summary>
        private IList<BirdEntity> Birds { get; set; }

        /// <summary>
        /// Gets or sets the duration of the level.
        /// </summary>
        private TimeSpan LevelDuration { get; set; }

        /// <summary>
        /// Fired when the level is over.
        /// </summary>
        public event Action LevelOver;

        /// <summary>
        /// Gets or sets the BeeEntity in the level.
        /// </summary>
        public BeeEntity Bee { get; set; }

        /// <summary>
        /// Fired when a bird should be released.
        /// </summary>
        public event Action<BirdEntity> ReleaseBird;

        public LevelManager(int level)
        {
            this.CurrentLevel = level;
            this.Random = new Random();

            this.ShootingBehaviors = new IShootingBehavior[]
            {
                new PassiveShooting(),
                new SingleBulletShooting(),
            };

            this.MovementBehaviors = new IMovementBehavior[]
            {
                new StraightMovementBehavior(),
            };
        }

        public override void Activate(Game game)
        {
            System.Diagnostics.Debug.Assert(this.Bee != null);

            base.Activate(game);

            this.TextureBody = this.ContentManager.Load<Texture2D>("sprites/bird_body");
            this.TextureFace = this.ContentManager.Load<Texture2D>("sprites/bird_face");
            this.TextureLegs = this.ContentManager.Load<Texture2D>("sprites/bird_legs");
            this.TextureHead = this.ContentManager.Load<Texture2D>("sprites/bird_head");
            this.TextureEyelids = this.ContentManager.Load<Texture2D>("sprites/bird_eyelids");

            var lLevelData = this.ConfigurationManager.LoadLevelData(this.CurrentLevel);

            var lBirdFactory = new BirdFactory(game, this.BulletFired, this.Bee);
            this.Birds = lLevelData.Birds.Select(x => lBirdFactory.CreateBird(x)).ToArray();
            this.TotalBirdCount = this.Birds.Count;
            this.LevelDuration = lLevelData.EndTime;
            
            this.CurrentBirdIndex = 0;
        }

        private bool CanReleaseBird(GameTime gameTime)
        {
            return
                (this.CurrentBirdIndex < this.Birds.Count) &&
                (this.Birds[this.CurrentBirdIndex].ReleaseTime <= (gameTime.TotalGameTime - this.LastRelease));
        }

        public void Update(GameTime gameTime)
        {
            if (this.LastRelease == default(TimeSpan))
            {
                this.LastRelease = gameTime.TotalGameTime;
            }

            while (this.CanReleaseBird(gameTime))
            {
                var lBird = this.Birds[this.CurrentBirdIndex];
                this.ReleaseBird(lBird);
                this.CurrentBirdIndex++;
                this.LastRelease = gameTime.TotalGameTime;
            }

            this.ElapsedTime += gameTime.ElapsedGameTime;
            if (this.ElapsedTime > this.LevelDuration)
            {
                this.LevelOver();
            }
        }

        /// <summary>
        /// Gets or sets the action which is called when a bullet is to be fired.
        /// </summary>
        public Action<BulletEntity> BulletFired { get; set; }
    }
}
