using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using BeeFree2.GameEntities;
using BeeFree2.GameEntities.Movement;
using BeeFree2.GameEntities.Shooting;
using BeeFree2.GameEntities.Extensions;
using BeeFree2.EntityManagers;
using BeeFree2.Controls;

namespace BeeFree2.GameScreens
{
    /// <summary>
    /// This is the primary gameplay screen when playing a specific level.
    /// </summary>
    public sealed class GameplayScreen : GameScreen
    {
        private IGameplayProvider mGameplayProvider;

        private readonly Func<IGameplayController, IGameplayProvider> mGameplayFactory;

        private GraphicalUserInterface mUserInterface;

        private ContentManager ContentManager { get; set; }

        private BulletManager BulletManager { get; set; }
        private CoinManager CoinManager { get; set; }
        private BeeManager BeeManager { get; set; }
        private BirdManager BirdManager { get; set; }
        private CloudManager CloudManager { get; set; }
        private PlayerManager PlayerManager { get; set; }
        private HeadsUpDisplay HeadsUpDisplay { get; set; }

        private int LevelIndex { get; set; }

        public GameplayScreen(Func<IGameplayController, IGameplayProvider> gameplayFactory)
        {
            this.mGameplayFactory = gameplayFactory;

            this.CloudManager = new CloudManager();
            this.BirdManager = new BirdManager();
            this.BulletManager = new BulletManager();
            this.CoinManager = new CoinManager();
        }

        public override void Activate(bool instancePreserved)
        {
            base.Activate(instancePreserved);

            this.ContentManager = this.ScreenManager.Game.Content;

            this.HeadsUpDisplay = new HeadsUpDisplay(this.ContentManager, this.LevelIndex);         

            this.mUserInterface = new GraphicalUserInterface(this);
            this.mUserInterface.Add(this.HeadsUpDisplay);

            this.ContentManager = this.ScreenManager.Game.Content;

            this.PlayerManager = this.ScreenManager.Game.Services.GetService<PlayerManager>();
            this.PlayerManager.Activate(this.ScreenManager.Game);

            var lBeeMovement = new MouseMovementBehavior(this.ScreenManager.InputState)
            {
                Velocity = Vector2.UnitX * (200 + (50 * this.PlayerManager.Player.BeeSpeed)),
            };

            var lBee = new BeeEntity
            {
                MovementBehavior = lBeeMovement,
                ShootingBehavior = GetBeeShootingBehavior(),
                MaximumHealth = 5 + (this.PlayerManager.Player.BeeMaxHealth * 5),
                CurrentHealth = 5 + (this.PlayerManager.Player.BeeMaxHealth * 5),
                HealthRegen = this.PlayerManager.Player.BeeHeathRegen,
            };
            lBee.OnDeath += this.Bee_OnDeath;

            System.Diagnostics.Debug.WriteLine("Bee Stats");
            System.Diagnostics.Debug.WriteLine("-----------------------");
            System.Diagnostics.Debug.WriteLine(string.Format("Movement Speed : {0}", lBee.MovementBehavior.Velocity));
            System.Diagnostics.Debug.WriteLine(string.Format("Attack Speed   : {0}", lBee.ShootingBehavior.FireRate));
            System.Diagnostics.Debug.WriteLine(string.Format("Damage         : {0}", lBee.ShootingBehavior.BulletDamage));
            System.Diagnostics.Debug.WriteLine(string.Format("Bullet Count   : {0}", this.PlayerManager.Player.BeeShotCount));
            System.Diagnostics.Debug.WriteLine(string.Format("Bullet Speed   : {0}", lBee.ShootingBehavior.BulletSpeed));
            System.Diagnostics.Debug.WriteLine(string.Format("Attraction     : {0}", this.PlayerManager.Player.BeeHoneycombAttraction));
            System.Diagnostics.Debug.WriteLine(string.Format("Health         : {0}", lBee.MaximumHealth));
            System.Diagnostics.Debug.WriteLine(string.Format("Health Regen   : {0}", lBee.HealthRegen));
            System.Diagnostics.Debug.WriteLine(string.Empty);

            this.BeeManager = new BeeManager() { Bee = lBee };

            var lGameplayController = new GameplayController(this);
            this.mGameplayProvider = this.mGameplayFactory(lGameplayController);            

            this.HeadsUpDisplay.CurrentHealth = this.BeeManager.Bee.MaximumHealth;
            this.HeadsUpDisplay.MaximumHealth = this.BeeManager.Bee.MaximumHealth;

            this.CoinManager.Activate(this.ScreenManager.Game);
            this.BulletManager.Activate(this.ScreenManager.Game);
            this.BirdManager.Activate(this.ScreenManager.Game);
            this.BeeManager.Activate(this.ScreenManager.Game);
            this.CloudManager.Activate(this.ScreenManager.Game);
        }

        /// <summary>
        /// Gets the appropriate shooting behavior for the bee.
        /// </summary>
        /// <param name="player"></param>
        /// <returns></returns>
        private IShootingBehavior GetBeeShootingBehavior()
        {
            IShootingBehavior lBehavior = null;

            switch (this.PlayerManager.Player.BeeShotCount)
            {
                case 0: lBehavior = new SingleBulletShooting { BulletDirection = Vector2.UnitX }; break;
                case 1: lBehavior = new DoubleBulletShooting { BulletDirection = Vector2.UnitX, Spread = 20f }; break;
                case 2: lBehavior = new TripleBulletShooting { BulletDirection = Vector2.UnitX, Spread = 30f }; break;

                default: throw new Exception("We do not support more than 3 singers.");
            }
            
            lBehavior.BulletTexture = this.ContentManager.Load<Texture2D>("sprites/bullet");
            lBehavior.BulletDamage = 1 + this.PlayerManager.Player.BeeDamage;
            lBehavior.FireBullet = this.BulletManager.Add;
            lBehavior.FireRate = TimeSpan.FromSeconds(1 - (0.18 * this.PlayerManager.Player.BeeFireRate));
            lBehavior.BulletSpeed = (200 + (20 * this.PlayerManager.Player.BeeBulletSpeed));

            return lBehavior;
        }

        private void Bee_OnDeath(BeeEntity bee)
        {
            this.PlayerManager.Player.DeathCount++;

            this.OnGamePlayOver();
        }

        private void OnGamePlayOver()
        {
            LoadingScreen.Load(this.ScreenManager, false, new LevelSelectionScreen());
        }

        public override void HandleInput(GameTime gameTime, InputState input)
        {
            base.HandleInput(gameTime, input);

            if (input.CurrentMouseState.LeftButton == ButtonState.Pressed)
            {
                this.BeeManager.Bee.ShootingBehavior.FireWhenReady(this.BeeManager.Bee, gameTime);
            }
        }

        public override void Unload()
        {
            base.Unload();
            this.ContentManager.Unload();

            this.CoinManager.Unload();
            this.BeeManager.Unload();
            this.BirdManager.Unload();
            this.BulletManager.Unload();
            this.CloudManager.Unload();
            this.PlayerManager.Unload();
        }

        public override void Update(GameTime gameTime, bool otherScreenHasFocus, bool coveredByOtherScreen)
        {
            base.Update(gameTime, otherScreenHasFocus, coveredByOtherScreen);

            this.CoinManager.Update(gameTime);
            this.BeeManager.Update(gameTime);
            this.BirdManager.Update(gameTime);
            this.BulletManager.Update(gameTime);
            this.CloudManager.Update(gameTime);
            this.BirdManager.Update(gameTime);

            this.mGameplayProvider.Update(gameTime);

            this.DetectBulletHits();
            this.DetectBirdHits();
            this.CollectCoins();

            this.mUserInterface.Update(gameTime, !otherScreenHasFocus && !coveredByOtherScreen);
        }

        /// <summary>
        /// Collects all the coins the bee is touching.
        /// </summary>
        private void CollectCoins()
        {
            var lDeadCoins = new HashSet<SimpleGameEntity>();

            foreach (var lCoin in this.CoinManager.ActiveCoins)
            {
                if (this.BeeManager.Bee.BoundingRectangle().Intersects(lCoin.BoundingRectangle()))
                {
                    var lPlayer = this.PlayerManager.Player;
                    lPlayer.TotalHoneycombCollected++;
                    lPlayer.AvailableHoneycombToSpend++;

                    this.HeadsUpDisplay.CoinsCollected++;

                    lDeadCoins.Add(lCoin);
                }
            }

            foreach (var lDeadCoin in lDeadCoins)
            {
                this.CoinManager.Remove(lDeadCoin);
            }
        }

        /// <summary>
        /// Detects physical collisions between the bee and birds.
        /// </summary>
        private void DetectBirdHits()
        {
            var lDeadBirds = new HashSet<BirdEntity>();

            foreach (var lBird in this.BirdManager.ActiveBirds)
            {
                var lBirdRadius = Math.Min(lBird.Size.X, lBird.Size.Y) / 2f;
                var lBeeRadius = this.BeeManager.Bee.HitRadius;

                var lBirdCenter = lBird.Position + (lBird.Size / 2f);
                var lBeeCenter = this.BeeManager.Bee.Position + (this.BeeManager.Bee.Size / 2f);

                if (GraphicsUtilities.CircleCollides(lBirdCenter, lBirdRadius, lBeeCenter, lBeeRadius))
                {
                    this.BeeManager.Bee.TakeDamage(lBird);
                    this.UpdateHealth();
                    lDeadBirds.Add(lBird);
                }
            }

            foreach (var lDeadBird in lDeadBirds) this.BirdManager.Remove(lDeadBird);
        }

        private void UpdateHealth()
        {
            this.HeadsUpDisplay.CurrentHealth = this.BeeManager.Bee.CurrentHealth;
            this.HeadsUpDisplay.MaximumHealth = this.BeeManager.Bee.MaximumHealth;
        }

        /// <summary>
        /// Detectes and acts upon any of the bullet hits within the screen.
        /// </summary>
        private void DetectBulletHits()
        {
            var lDeadBullets = new HashSet<BulletEntity>();

            foreach (var lBadBullet in this.BulletManager.ActiveBullets.Where(x => !x.IsFriendly))
            {
                var lBulletRadius = Math.Min(lBadBullet.Size.X, lBadBullet.Size.Y) / 2f;
                var lBeeRadius = this.BeeManager.Bee.HitRadius;

                var lBulletCenter = lBadBullet.Position + (lBadBullet.Size / 2f);
                var lBeeCenter = this.BeeManager.Bee.Position + (this.BeeManager.Bee.Size / 2f);

                if (GraphicsUtilities.CircleCollides(lBulletCenter, lBulletRadius, lBeeCenter, lBeeRadius))
                {
                    this.BeeManager.Bee.TakeDamage(lBadBullet);
                    this.UpdateHealth();
                    lDeadBullets.Add(lBadBullet);
                }
            }

            foreach (var lGoodBullet in this.BulletManager.ActiveBullets.Where(x => x.IsFriendly))
            {
                foreach (var lBird in this.BirdManager.ActiveBirds)
                {
                    var lBulletRadius = Math.Min(lGoodBullet.Size.X, lGoodBullet.Size.Y) / 2f;
                    var lBirdRadius = Math.Min(lBird.Size.X, lBird.Size.Y) / 2f;

                    var lBulletCenter = lGoodBullet.Position + (lGoodBullet.Size / 2f);
                    var lBirdCenter = lBird.Position + (lBird.Size / 2f);

                    if (GraphicsUtilities.CircleCollides(lBulletCenter, lBulletRadius, lBirdCenter, lBirdRadius))
                    {
                        lBird.TakeDamage(lGoodBullet);
                        lDeadBullets.Add(lGoodBullet);
                    }
                }
            }

            foreach (var lBullet in lDeadBullets)
            {
                this.BulletManager.Remove(lBullet);
            }
        }

        public override void Draw(GameTime gameTime)
        {
            base.Draw(gameTime);

            var lSpriteBatch = this.ScreenManager.SpriteBatch;

            lSpriteBatch.Begin();
            this.CloudManager.Draw(lSpriteBatch, gameTime);
            this.BulletManager.Draw(lSpriteBatch, gameTime);
            this.BirdManager.Draw(lSpriteBatch, gameTime);            
            this.CoinManager.Draw(lSpriteBatch, gameTime);
            this.BeeManager.Draw(lSpriteBatch, gameTime);
            lSpriteBatch.End();

            this.mUserInterface.Draw(gameTime);
        }

        private sealed class GameplayController : IGameplayController
        {
            private readonly GameplayScreen mScreen;

            private int mTotalBirdsReleased;

            public GameplayController(GameplayScreen screen)
            {
                this.mScreen = screen;
            }

            public Game Game => this.mScreen.ScreenManager.Game;

            public TimeSpan? TimeRemaining
            {
                get => this.mScreen.HeadsUpDisplay.TimeRemaining;
                set => this.mScreen.HeadsUpDisplay.TimeRemaining = value;
            }

            public string LevelName
            {
                get => this.mScreen.HeadsUpDisplay.LevelName;
                set => this.mScreen.HeadsUpDisplay.LevelName = value;
            }

            public int BirdsKilled
            {
                get => this.mScreen.HeadsUpDisplay.BirdsKilled;
                set => this.mScreen.HeadsUpDisplay.BirdsKilled = value;
            }

            public int HoneycombCollected
            {
                get => this.mScreen.HeadsUpDisplay.CoinsCollected;
                set => this.mScreen.HeadsUpDisplay.CoinsCollected = value;
            }

            /// <summary>
            /// When a bird is released, we add it to the bird manager, but we're also interested in when it dies.
            /// </summary>
            /// <param name="bird">The bird to release.</param>
            public void AddBird(BirdEntity birdEntity)
            {
                this.mScreen.BirdManager.Add(birdEntity);
                birdEntity.OnDeath += this.Bird_OnDeath;
            }

            public void OnLevelComplete()
            {
                var lWasFlawlessCompletion = !this.mScreen.BeeManager.Bee.HasTakenDamage;
                var lWasPerfectCompletion = (this.mScreen.HeadsUpDisplay.BirdsKilled == this.mTotalBirdsReleased);

                this.mScreen.PlayerManager.Player.MarkLevelCompleted(this.mScreen.LevelIndex, lWasFlawlessCompletion, lWasPerfectCompletion);
                this.mScreen.PlayerManager.Player.MarkLevelAvailable(this.mScreen.LevelIndex + 1);
                this.mScreen.PlayerManager.SavePlayer();

                this.mScreen.OnGamePlayOver();
            }

            /// <summary>
            /// When a bird dies, we need to spawn a new coin in its place.
            /// </summary>
            /// <param name="bird">The bird that died.</param>
            private void Bird_OnDeath(BirdEntity bird)
            {
                this.mScreen.HeadsUpDisplay.BirdsKilled++;

                var lCoin = new SimpleGameEntity
                {
                    MovementBehavior = new GravityMovementBehavior
                    {
                        TargetEntity = this.mScreen.BeeManager.Bee,
                        Position = bird.Position,
                        Velocity = Vector2.UnitX * -300,
                        Acceleration = Vector2.UnitX * (40 * this.mScreen.PlayerManager.Player.BeeHoneycombAttraction),
                    },
                };

                this.mScreen.CoinManager.Add(lCoin);
            }
        }
    }
}
