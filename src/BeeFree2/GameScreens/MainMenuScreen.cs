using System.Collections.Generic;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using BeeFree2.EntityManagers;
using BeeFree2.GameEntities;
using BeeFree2.Controls;

namespace BeeFree2.GameScreens
{
    /// <summary>
    /// Defines the screen which works as the main menu.
    /// </summary>
    internal class MainMenuScreen : GameScreen
    {
        private GraphicalUserInterface mUserInterface;

        private SpriteFont MainMenuFont { get; set; }
        private SpriteFont MainMenuFontBold { get; set; }

        private PlayerManager mPlayerManager;

        /// <summary>
        /// Gets or sets the texture for the background.
        /// </summary>
        private Texture2D BackgroundTexture { get; set; }

        public override void Activate(bool instancePreserved)
        {
            base.Activate(instancePreserved);

            var lContent = this.ScreenManager.Game.Content;

            this.mPlayerManager = this.ScreenManager.Game.Services.GetService<PlayerManager>();

            var lGamePersistanceService = this.ScreenManager.Game.Services.GetService<GamePersistanceService>();

            this.MainMenuFont = lContent.Load<SpriteFont>("Fonts/MainMenuFont");
            this.MainMenuFontBold = lContent.Load<SpriteFont>("Fonts/MainMenuFontBold");

            var lStackPanel = new HorizontalStackPanel();
            lStackPanel.Margin = new Thickness(50, 250, 0, 0);
            lStackPanel.Add(new SaveSlotGroup(this, 0));
            lStackPanel.Add(new SaveSlotGroup(this, 1));

            this.mUserInterface = new GraphicalUserInterface(this.ScreenManager.SpriteBatch, this.ScreenManager.InputState);
            this.mUserInterface.Add(lStackPanel);

            this.BackgroundTexture = lContent.Load<Texture2D>("sprites/mainmenubackground");
        }

        private void ContinuePreviousGame(SaveSlot saveSlot)
        {
            this.mPlayerManager.LoadPlayer(saveSlot);
            LoadingScreen.Load(this.ScreenManager, true, new LevelSelectionScreen());
        }

        private void StartNewGame(SaveSlot saveSlot)
        {
            this.mPlayerManager.CreateNewPlayer(saveSlot);
            LoadingScreen.Load(this.ScreenManager, true, new LevelSelectionScreen());
        }

        public override void Update(GameTime gameTime, bool otherScreenHasFocus, bool coveredByOtherScreen)
        {
            base.Update(gameTime, otherScreenHasFocus, coveredByOtherScreen);
            this.mUserInterface.Update(gameTime, !otherScreenHasFocus && !coveredByOtherScreen);
        }

        public override void Draw(GameTime gameTime)
        {
            this.ScreenManager.SpriteBatch.Begin();

            this.ScreenManager.SpriteBatch.Draw(this.BackgroundTexture, Vector2.Zero, null, Color.White, 0, Vector2.Zero, 1, SpriteEffects.None, 0);

            base.Draw(gameTime);

            this.ScreenManager.SpriteBatch.End();

            this.mUserInterface.Draw(gameTime);
        }

        private sealed class SaveSlotGroup : GraphicsContainer
        {
            private readonly MainMenuScreen mScreen;
            private readonly SaveSlot mSaveSlot;

            private readonly Button mButton_NewGame;
            private readonly Button mButton_ContinueGame;
            private readonly Button mButton_ExitGame;

            private readonly TextBlock mTextBlock_NewGame;
            private readonly TextBlock mTextBlock_ContinueGame;
            private readonly TextBlock mTextBlock_ExitGame;

            public SaveSlotGroup(MainMenuScreen screen, SaveSlot saveSlot)
            {
                this.mScreen = screen;
                this.mSaveSlot = saveSlot;

                this.Margin = new Thickness(5, 0);
                this.BorderColor = Color.Black;
                this.BackgroundColor = Color.White;
                this.Padding = new Thickness(5);

                this.mTextBlock_NewGame = new TextBlock("New Game", this.mScreen.MainMenuFont);
                this.mTextBlock_ContinueGame = new TextBlock("Continue Game", this.mScreen.MainMenuFont);
                this.mTextBlock_ExitGame = new TextBlock("Exit", this.mScreen.MainMenuFont);

                this.mButton_NewGame = new Button(this.mTextBlock_NewGame);
                this.mButton_ContinueGame = new Button(this.mTextBlock_ContinueGame);
                this.mButton_ExitGame = new Button(this.mTextBlock_ExitGame);

                this.InitializeButton(this.mButton_NewGame, this.mTextBlock_NewGame);
                this.InitializeButton(this.mButton_ContinueGame, this.mTextBlock_ContinueGame);
                this.InitializeButton(this.mButton_ExitGame, this.mTextBlock_ExitGame);

                var lHeader = new TextBlock($"Slot {this.mSaveSlot}", this.mScreen.MainMenuFont);
                lHeader.HorizontalAlignment = HorizontalAlignment.Center;

                var lStackPanel = new VerticalStackPanel();
                lStackPanel.Add(lHeader);
                lStackPanel.Add(this.mButton_NewGame);
                lStackPanel.Add(this.mButton_ContinueGame);
                lStackPanel.Add(this.mButton_ExitGame);

                this.Add(lStackPanel);
            }

            public override void UpdateFinalize(GameTime gameTime)
            {
                base.UpdateFinalize(gameTime);

                this.UpdateButton(this.mButton_NewGame, this.mTextBlock_NewGame);
                this.UpdateButton(this.mButton_ContinueGame, this.mTextBlock_ContinueGame);
                this.UpdateButton(this.mButton_ExitGame, this.mTextBlock_ExitGame);

                if (this.mButton_NewGame.WasClicked) this.mScreen.StartNewGame(this.mSaveSlot);
                else if (this.mButton_ContinueGame.WasClicked) this.mScreen.ContinuePreviousGame(this.mSaveSlot);
                else if (this.mButton_ExitGame.WasClicked) this.mScreen.ScreenManager.Game.Exit();
            }

            private void UpdateButton(Button b, TextBlock t)
            {
                if (b.IsMouseOver)
                {
                    t.Font = this.mScreen.MainMenuFontBold;
                    t.ForeColor = Color.White;

                    b.BorderColor = Color.White;
                    b.BorderThickness = new Thickness(6);
                    b.BackgroundColor = Color.DarkGoldenrod;
                }
                else
                {
                    t.Font = this.mScreen.MainMenuFont;
                    t.ForeColor = Color.Black;

                    b.BorderColor = Color.Black;
                    b.BorderThickness = new Thickness(4);
                    b.BackgroundColor = Color.Gold;
                }
            }

            private void InitializeButton(Button b, TextBlock t)
            {
                this.UpdateButton(b, t);

                b.HorizontalAlignment = HorizontalAlignment.Stretch;
                b.Margin = new Thickness(0, 5);
                b.Width = 250;
                b.Height = 50;

                t.HorizontalAlignment = HorizontalAlignment.Center;
                t.VerticalAlignment = VerticalAlignment.Center;
            }
        }
    }
}
