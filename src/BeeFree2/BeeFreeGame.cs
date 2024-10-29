using System;
using BeeFree2.Config;
using BeeFree2.Controls;
using BeeFree2.EntityManagers;
using BeeFree2.GameScreens;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;

namespace BeeFree2
{

    /// <summary>
    /// This is the main type for your game
    /// </summary>
    public class BeeFreeGame : Game
    {
        GraphicsDeviceManager mGraphics;

        private bool mShowPerformanceMetrics;

        private GraphicalUserInterface mUserInterface;

        private TextBlock mTextBlock_FrameRate;

        ScreenManager mScreenManager;

        public BeeFreeGame()
        {
            this.IsMouseVisible = true;
            this.Content.RootDirectory = "Content";

            this.mGraphics = new GraphicsDeviceManager(this);                       

            this.TargetElapsedTime = TimeSpan.FromTicks(333333);

            this.mScreenManager = new ScreenManager(this);
            this.Components.Add(this.mScreenManager);
        }

        /// <summary>
        /// Allows the game to perform any initialization it needs to before starting to run.
        /// This is where it can query for any required services and load any non-graphic
        /// related content.  Calling base.Initialize will enumerate through any components
        /// and initialize them as well.
        /// </summary>
        protected override void Initialize()
        {
            this.Services.AddService(new ConfigurationManager());
            this.Services.AddService(new GamePersistanceService());

            var lPlayerManager = new PlayerManager();
            lPlayerManager.Activate(this);
            this.Services.AddService(lPlayerManager);

            var lIsTesting = true;
            if (lIsTesting)
            {
                lPlayerManager.LoadPlayer(0);

                this.mScreenManager.AddScreen(new LevelSelectionScreen(), null);
            }
            else
            {
                this.mScreenManager.AddScreen(new MainMenuScreen(), null);
            }

            base.Initialize();
        }

        protected override void LoadContent()
        {
            base.LoadContent();

            var lFont = this.Content.Load<SpriteFont>(AssetNames.Fonts.Standard_12);

            this.mTextBlock_FrameRate = new TextBlock();
            this.mTextBlock_FrameRate.Font = lFont;

            var lStackPanel = new HorizontalStackPanel();
            lStackPanel.VerticalAlignment = VerticalAlignment.Top;
            lStackPanel.HorizontalAlignment = HorizontalAlignment.Right;
            lStackPanel.Add(new TextBlock("Frame Rate: ", lFont));
            lStackPanel.Add(this.mTextBlock_FrameRate);

            this.mUserInterface = new GraphicalUserInterface(this.mScreenManager);
            this.mUserInterface.Add(lStackPanel);
        }

        protected override void Update(GameTime gameTime)
        {
            base.Update(gameTime);

            if (this.mScreenManager.InputState.IsNewKeyPress(Keys.F11, null, out _))
            {
                this.mShowPerformanceMetrics = !this.mShowPerformanceMetrics;
            }

            if (this.mShowPerformanceMetrics)
            {
                var lFrameRate = 1.0 / gameTime.ElapsedGameTime.TotalSeconds;
                this.mTextBlock_FrameRate.Text = lFrameRate.ToString("0.0");

                this.mUserInterface.Update(gameTime, false);
            }
        }

        protected override void Draw(GameTime gameTime)
        {
            this.GraphicsDevice.Clear(Color.SkyBlue);
            base.Draw(gameTime);

            if (this.mShowPerformanceMetrics)
            {
                this.mUserInterface.Draw(gameTime);
            }
        }
    }
}
