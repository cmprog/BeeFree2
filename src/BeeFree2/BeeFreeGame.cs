using System;
using BeeFree2.Config;
using BeeFree2.EntityManagers;
using BeeFree2.GameScreens;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace BeeFree2
{

    /// <summary>
    /// This is the main type for your game
    /// </summary>
    public class BeeFreeGame : Game
    {
        GraphicsDeviceManager mGraphics;

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

            var lIsTesting = false;
            if (lIsTesting)
            {
                this.mScreenManager.AddScreen(new CustomExamplMenuScreen(), null);
            }
            else
            {
                this.mScreenManager.AddScreen(new MainMenuScreen(), null); 
            }

            base.Initialize();
        }

        /// <summary>
        /// This is called when the game should draw itself.
        /// </summary>
        /// <param name="gameTime">Provides a snapshot of timing values.</param>
        protected override void Draw(GameTime gameTime)
        {
            GraphicsDevice.Clear(Color.SkyBlue);
            base.Draw(gameTime);
        }
    }
}
