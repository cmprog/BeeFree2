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

        private PlayerManager mPlayerManager;

        private MenuButton mMenuButton_NewGame;
        private MenuButton mMenuButton_ContinueGame;
        private MenuButton mMenuButton_LoadGame;
        private MenuButton mMenuButton_Quit;

        private TextBlock mTextBlock_MenuDescription;

        /// <summary>
        /// Gets or sets the texture for the background.
        /// </summary>
        private Texture2D BackgroundTexture { get; set; }

        public override void Activate(bool instancePreserved)
        {
            base.Activate(instancePreserved);

            var lContent = this.ScreenManager.Game.Content;

            this.mPlayerManager = this.ScreenManager.Game.Services.GetService<PlayerManager>();

            var lStandardMenuFont = lContent.Load<SpriteFont>(AssetNames.Fonts.Standard_14);

            this.mMenuButton_NewGame = this.CreateMenuButton("New Game", lStandardMenuFont);
            this.mMenuButton_ContinueGame = this.CreateMenuButton("Continue Game", lStandardMenuFont);
            this.mMenuButton_LoadGame = this.CreateMenuButton("Load Game", lStandardMenuFont);
            this.mMenuButton_Quit = this.CreateMenuButton("Quit", lStandardMenuFont);

            this.mTextBlock_MenuDescription = new TextBlock("", lStandardMenuFont);
            this.mTextBlock_MenuDescription.VerticalAlignment = VerticalAlignment.Center;
            this.mTextBlock_MenuDescription.HorizontalAlignment = HorizontalAlignment.Center;

            var lMenuDescriptionBorder = new Border();
            lMenuDescriptionBorder.BackgroundTexture = lContent.Load<Texture2D>(AssetNames.Spritesheet.Flat);
            lMenuDescriptionBorder.BackgroundTextureScale = Spritesheets.Flat.InfoBox;
            lMenuDescriptionBorder.Width = 400;
            lMenuDescriptionBorder.Height = 50;
            lMenuDescriptionBorder.Margin = new ThicknessF(10);
            lMenuDescriptionBorder.Add(this.mTextBlock_MenuDescription);

            var lStackPanel = new VerticalStackPanel();
            lStackPanel.HorizontalAlignment = HorizontalAlignment.Center;
            lStackPanel.VerticalAlignment = VerticalAlignment.Bottom;
            lStackPanel.Add(this.mMenuButton_NewGame);
            lStackPanel.Add(this.mMenuButton_ContinueGame);
            lStackPanel.Add(this.mMenuButton_LoadGame);
            lStackPanel.Add(this.mMenuButton_Quit);
            lStackPanel.Add(lMenuDescriptionBorder);

            this.mUserInterface = new GraphicalUserInterface(this);
            this.mUserInterface.Add(lStackPanel);

            this.BackgroundTexture = lContent.Load<Texture2D>(AssetNames.Sprites.MainMenuBackground);
        }

        private MenuButton CreateMenuButton(string text, SpriteFont standardFont)
        {
            var lMenuButton = new MenuButton(this.ScreenManager.Game.Content, text, standardFont);            
            lMenuButton.HorizontalAlignment = HorizontalAlignment.Center;
            lMenuButton.Margin = new ThicknessF(0, 5);
            lMenuButton.Width = 200;
            lMenuButton.Height = 60;
            return lMenuButton;
        }

        private void ContinuePreviousGame()
        {
            if (this.mPlayerManager.TryGetPreviousSaveSlot(out var lSaveSlot))
            {
                this.mPlayerManager.LoadPlayer(lSaveSlot);
                LoadingScreen.Load(this.ScreenManager, true, new LevelSelectionScreen());
            }
        }

        private void StartNewGame()
        {
            this.mPlayerManager.CreateNewPlayer();
            LoadingScreen.Load(this.ScreenManager, true, new LevelSelectionScreen());
        }

        public override void Update(GameTime gameTime, bool otherScreenHasFocus, bool coveredByOtherScreen)
        {
            base.Update(gameTime, otherScreenHasFocus, coveredByOtherScreen);
            this.mUserInterface.Update(gameTime, !otherScreenHasFocus && !coveredByOtherScreen);

            if (this.mMenuButton_NewGame.IsMouseOver)
            {
                this.mTextBlock_MenuDescription.Text = "Create a new game from the beginning.";
            }
            else if (this.mMenuButton_ContinueGame.IsMouseOver)
            {
                this.mTextBlock_MenuDescription.Text = "Continue playing the last saved game.";
            }
            else if (this.mMenuButton_LoadGame.IsMouseOver)
            {
                this.mTextBlock_MenuDescription.Text = "Choose a previously saved game to continue.";
            }
            else if (this.mMenuButton_Quit.IsMouseOver)
            {
                this.mTextBlock_MenuDescription.Text = "Quit the game.";
            }
            else
            {
                this.mTextBlock_MenuDescription.Text = null;
            }
        }

        public override void HandleInput(GameTime gameTime, InputState input)
        {
            base.HandleInput(gameTime, input);

            if (this.mMenuButton_NewGame.WasClicked)
            {
                this.StartNewGame();
            }
            else if (this.mMenuButton_ContinueGame.WasClicked)
            {
                this.ContinuePreviousGame();
            }
            else if (this.mMenuButton_LoadGame.WasClicked)
            {
                LoadingScreen.Load(this.ScreenManager, false, new LoadGameScreen());
            }
            else if (this.mMenuButton_Quit.WasClicked)
            {
                this.ScreenManager.Game.Exit();
            }

        }

        public override void Draw(GameTime gameTime)
        {
            this.ScreenManager.SpriteBatch.Begin();

            this.ScreenManager.SpriteBatch.Draw(this.BackgroundTexture, Vector2.Zero, null, Color.White, 0, Vector2.Zero, 1, SpriteEffects.None, 0);

            base.Draw(gameTime);

            this.ScreenManager.SpriteBatch.End();

            this.mUserInterface.Draw(gameTime);
        }
    }
}
