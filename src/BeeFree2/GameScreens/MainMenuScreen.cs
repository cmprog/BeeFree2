using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using BeeFree2.EntityManagers;
using BeeFree2.Controls;
using BeeFree2.GameEntities;

namespace BeeFree2.GameScreens
{
    /// <summary>
    /// Defines the screen which works as the main menu.
    /// </summary>
    internal sealed class MainMenuScreen : GameScreen
    {
        private GraphicalUserInterface mUserInterface;

        private SpriteFont StandardMenuFont { get; set; }
        private SpriteFont ActiveMenuFont { get; set; }

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

            this.StandardMenuFont = lContent.Load<SpriteFont>(AssetNames.Fonts.Standard_14);
            this.ActiveMenuFont = lContent.Load<SpriteFont>(AssetNames.Fonts.Standard_18);

            var lStackPanel = new HorizontalStackPanel();
            lStackPanel.Margin = new Thickness(50, 250, 0, 0);
            lStackPanel.Add(new SaveSlotGroup(this, 0));
            lStackPanel.Add(new SaveSlotGroup(this, 1));

            this.mUserInterface = new GraphicalUserInterface(this);
            this.mUserInterface.Add(lStackPanel);

            this.BackgroundTexture = lContent.Load<Texture2D>(AssetNames.Sprites.MainMenuBackground);
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

            private readonly MenuButton mMenuButton_NewGame;
            private readonly MenuButton mMenuButton_ContinueGame;

            public SaveSlotGroup(MainMenuScreen screen, SaveSlot saveSlot)
            {
                this.mScreen = screen;
                this.mSaveSlot = saveSlot;

                this.Margin = new Thickness(5, 0);
                this.BorderColor = Color.Black;
                this.BackgroundColor = Color.White;
                this.Padding = new Thickness(5);

                this.mMenuButton_NewGame = this.CreateMenuButton("New Game");
                this.mMenuButton_ContinueGame = this.CreateMenuButton("Continue");

                var lHeader = new TextBlock($"Slot {this.mSaveSlot}", this.mScreen.StandardMenuFont);
                lHeader.HorizontalAlignment = HorizontalAlignment.Center;

                var lStackPanel = new VerticalStackPanel();
                lStackPanel.Add(lHeader);
                lStackPanel.Add(this.mMenuButton_NewGame);
                lStackPanel.Add(this.mMenuButton_ContinueGame);

                this.Add(lStackPanel);
            }

            public override void UpdateFinalize(GameTime gameTime)
            {
                base.UpdateFinalize(gameTime);

                if (this.mMenuButton_NewGame.WasClicked) this.mScreen.StartNewGame(this.mSaveSlot);
                else if (this.mMenuButton_ContinueGame.WasClicked) this.mScreen.ContinuePreviousGame(this.mSaveSlot);
            }

            private MenuButton CreateMenuButton(string text)
            {
                var lMenuButton = new MenuButton(text, this.mScreen.StandardMenuFont, this.mScreen.ActiveMenuFont);
                lMenuButton.Margin = new Thickness(0, 5);
                lMenuButton.MinWidth = 150;
                lMenuButton.MinHeight = 60;
                return lMenuButton;
            }
        }
    }
}
