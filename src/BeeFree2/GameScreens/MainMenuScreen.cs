using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using BeeFree2.EntityManagers;
using BeeFree2.GameEntities;

namespace BeeFree2.GameScreens
{
    /// <summary>
    /// Defines the screen which works as the main menu.
    /// </summary>
    internal class MainMenuScreen : GameScreen
    {
        private MainMenuButton mNewGameButton;
        private MainMenuButton mContinueGameButton;
        private MainMenuButton mExitButton;

        private SpriteFont MainMenuFont { get; set; }
        private SpriteFont MainMenuFontBold { get; set; }

        private List<MainMenuButton> mButtons;

        /// <summary>
        /// Gets or sets the texture for the background.
        /// </summary>
        private Texture2D BackgroundTexture { get; set; }

        private PlayerManager PlayerManager { get; set; }

        public MainMenuScreen()
        {
            this.PlayerManager = new PlayerManager();
        }

        public override void Activate(bool instancePreserved)
        {
            base.Activate(instancePreserved);

            var lContent = this.ScreenManager.Game.Content;

            this.MainMenuFont = lContent.Load<SpriteFont>("Fonts/MainMenuFont");
            this.MainMenuFontBold = lContent.Load<SpriteFont>("Fonts/MainMenuFontBold");

            var lButtonSize = new Vector2(250, 50);

            this.BackgroundTexture = lContent.Load<Texture2D>("sprites/mainmenubackground");

            var lBlankTexture = new Texture2D(this.ScreenManager.GraphicsDevice, 1, 1);
            lBlankTexture.SetData(new[] { Color.White });

            var lCurrentPosition = new Vector2(50f, 275f);

            this.PlayerManager.Activate(this.ScreenManager.Game);

            this.mNewGameButton = new MainMenuButton
            {
                Text = "New Game",
                InactiveFont = this.MainMenuFont,
                ActiveFont = this.MainMenuFontBold,
                BlankTexture = lBlankTexture,
                Position = lCurrentPosition,
                Size = lButtonSize,
                IsActive = false,
                IsEnabled = true,
            };
            this.mNewGameButton.Selected += (s, e) => this.StartNewGame();

            lCurrentPosition.Y += lButtonSize.Y + 10;

            this.mContinueGameButton = new MainMenuButton
            {
                Text = "Continue Game",
                InactiveFont = this.MainMenuFont,
                ActiveFont = this.MainMenuFontBold,
                BlankTexture = lBlankTexture,
                Position = lCurrentPosition,
                Size = lButtonSize,
                IsActive = false,
                IsEnabled = this.PlayerManager.SaveGameExists,
            };
            this.mContinueGameButton.Selected += (s, e) => this.ContinuePreviousGame();

            lCurrentPosition.Y += lButtonSize.Y + 10;

            this.mExitButton = new MainMenuButton
            {
                Text = "Exit",
                InactiveFont = this.MainMenuFont,
                ActiveFont = this.MainMenuFontBold,
                BlankTexture = lBlankTexture,
                Position = lCurrentPosition,
                Size = lButtonSize,
                IsActive = false,
                IsEnabled = this.PlayerManager.SaveGameExists,
            };
            this.mExitButton.Selected += (s, e) => this.ScreenManager.Game.Exit();

            this.mButtons = new List<MainMenuButton>();
            this.mButtons.Add(this.mNewGameButton);
            this.mButtons.Add(this.mContinueGameButton);
            this.mButtons.Add(this.mExitButton);
        }

        public override void Unload()
        {
            base.Unload();
            this.PlayerManager.Unload();
        }

        private void ContinuePreviousGame()
        {
            LoadingScreen.Load(this.ScreenManager, true, new LevelSelectionScreen());
        }

        private void StartNewGame()
        {
            this.PlayerManager.CreateNewPlayer();
            LoadingScreen.Load(this.ScreenManager, true, new LevelSelectionScreen());
        }

        public override void HandleInput(GameTime gameTime, InputState input)
        {
            base.HandleInput(gameTime, input);

            foreach (var lButton in this.mButtons)
            {
                lButton.IsActive = lButton.Bounds.Contains(input.CurrentMouseState.X, input.CurrentMouseState.Y);

                if (lButton.IsActive && input.IsLeftMouseClick)
                {
                    lButton.OnSelectEntry();
                }
            }
        }

        public override void Draw(GameTime gameTime)
        {
            this.ScreenManager.SpriteBatch.Begin();

            this.ScreenManager.SpriteBatch.Draw(this.BackgroundTexture, Vector2.Zero, null, Color.White, 0, Vector2.Zero, 1, SpriteEffects.None, 0);
            base.Draw(gameTime);
            foreach (var lButton in this.mButtons)
            {
                lButton.Draw(this.ScreenManager.SpriteBatch);
            }

            this.ScreenManager.SpriteBatch.End();
        }
    }
}
