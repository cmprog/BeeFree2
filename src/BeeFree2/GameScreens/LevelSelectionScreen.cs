using System;
using System.Linq;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;
using BeeFree2.GameEntities;
using BeeFree2.EntityManagers;

namespace BeeFree2.GameScreens
{
    /// <summary>
    /// This screen allows the user to select the level they want to play. It also lets them shop and
    /// view some of their information.
    /// </summary>
    internal class LevelSelectionScreen : GameScreen
    {
        private ContentManager ContentManager => this.ScreenManager.Game.Content;

        private PlayerManager PlayerManager { get; set; }
        private LevelSelectionButton[] Buttons { get; set; }

        /// <summary>
        /// Gets or sets the back button - this will go back to the main menu screen.
        /// </summary>
        private MainMenuButton BackButton { get; set; }

        /// <summary>
        /// Gets or sets the button to access the shop.
        /// </summary>
        private MainMenuButton ShopButton { get; set; }

        /// <summary>
        /// Gets or sets the background texture.
        /// </summary>
        private Texture2D BackgroundTexture { get; set; }

        /// <summary>
        /// Gets or sets a blank texture which can be used for drawing basic shapes. Tint it for flavor.
        /// </summary>
        private Texture2D BlankTexture { get; set; }

        /// <summary>
        /// Gets or sets the basic font to use for text.
        /// </summary>
        private SpriteFont BasicFont { get; set; }
        
        public override void Activate(bool instancePreserved)
        {
            base.Activate(instancePreserved);

            var lViewport = this.ScreenManager.Game.GraphicsDevice.Viewport;
            var lScreenSize = new Vector2(lViewport.Width, lViewport.Height);
            
            this.BackgroundTexture = this.ContentManager.Load<Texture2D>("Sprites/LevelSelectBackground");
            this.BasicFont = this.ContentManager.Load<SpriteFont>("Fonts/MainMenuFont");

            this.PlayerManager = this.ScreenManager.Game.Services.GetService<PlayerManager>();

            this.BlankTexture = new Texture2D(this.ScreenManager.GraphicsDevice, 1, 1);
            this.BlankTexture.SetData(new[] { Color.White });

            var lButtonTexts = new[] { 
                "I", "II", "III", "IV", "V",
                "VI", "VII", "VIII", "IX", "X",
                "XI", "XII", "XIII", "XIV", "XV",
                "XVI", "XVII", "XVIII", "IXX", "XX" }; ;

            var lButtonTexture = this.ContentManager.Load<Texture2D>("Sprites/LevelSelectionButton");
            var lPerfectTexture = this.ContentManager.Load<Texture2D>("Sprites/Perfect");
            var lFlawlessTexture = this.ContentManager.Load<Texture2D>("Sprites/Flawless");
            var lButtonSize = new Vector2(lButtonTexture.Width, lButtonTexture.Height);

            this.Buttons = Enumerable.Range(0, 20).Select(x => {

                var lLevelData = this.PlayerManager.Player.GetLevelData(x);

                return new LevelSelectionButton
                {
                    Text = lButtonTexts[x],
                    LevelIndex = x,
                    ActiveFont = this.BasicFont,
                    InactiveFont = this.BasicFont,
                    Texture = lButtonTexture,
                    PerfectTexture = lPerfectTexture,
                    FlawlessTexture = lFlawlessTexture,
                    Size = lButtonSize,
                    IsAvailable = lLevelData.IsAvailable,
                    IsFlawless = lLevelData.CompletedFlawlessly,
                    IsPerfect = lLevelData.CompletedPerfectly,
                };
            })
            .ToArray();

            this.ShopButton = new MainMenuButton
            {
                Position = new Vector2(635, 410),
                Size = new Vector2(150, 60),
                BlankTexture = this.BlankTexture,
                ActiveFont = this.BasicFont,
                InactiveFont = this.BasicFont,
                Text = "Shop",
            };

            this.BackButton = new MainMenuButton
            {
                Position = new Vector2(465, 410),
                Size = new Vector2(150, 60),
                BlankTexture = this.BlankTexture,
                ActiveFont = this.BasicFont,
                InactiveFont = this.BasicFont,
                Text = "Back",
            };
            
            for (int lRowIndex = 0; lRowIndex < 4; lRowIndex++)
            {
                for (int lColumnIndex = 0; lColumnIndex < 5; lColumnIndex++)
                {
                    var lButton = this.Buttons[(lRowIndex * 5) + lColumnIndex];

                    lButton.Position = new Vector2(5 + (lColumnIndex * (lButton.Size.X + 5)), 17 + (lRowIndex * (lButton.Size.Y + 17)));
                    lButton.Selected += this.Button_Selected;
                }
            }
        }

        public override void Unload()
        {
            base.Unload();
            this.ContentManager.Unload();
            this.PlayerManager.Unload();
        }

        private void GamePlayScreen_GamePlayOver()
        {
            LoadingScreen.Load(this.ScreenManager, false, this);
        }

        private void Button_Selected(object sender, EventArgs e)
        {
            var lButton = (LevelSelectionButton)sender;
            
            var lGameplayScreen = new GameplayScreen(lButton.LevelIndex);
            lGameplayScreen.GamePlayOver += this.GamePlayScreen_GamePlayOver;

            this.PlayerManager.Player.MarkLevelPlayed(lButton.LevelIndex);
            this.PlayerManager.SavePlayer();

            LoadingScreen.Load(this.ScreenManager, true, lGameplayScreen);
        }

        public override void HandleInput(GameTime gameTime, InputState input)
        {
            base.HandleInput(gameTime, input);

            if (input.IsLeftMouseClick)
            {
                foreach (var lButton in this.Buttons.Where(x => x.IsAvailable))
                {
                    if (GraphicsUtilities.RectangleContains(
                        lButton.Position, lButton.Size, 
                        input.CurrentMouseState.X, input.CurrentMouseState.Y))
                    {
                        lButton.OnSelected();
                    }
                }

                if (this.ShopButton.Bounds.Contains(input.CurrentMouseState.X, input.CurrentMouseState.Y))
                {
                    LoadingScreen.Load(this.ScreenManager, true, new ShopScreen());
                }

                if (this.BackButton.Bounds.Contains(input.CurrentMouseState.X, input.CurrentMouseState.Y))
                {
                    LoadingScreen.Load(this.ScreenManager, false, new MainMenuScreen());
                }
            }
        }

        public override void Draw(GameTime gameTime)
        {
            base.Draw(gameTime);

            var lSpriteBatch = this.ScreenManager.SpriteBatch;
            lSpriteBatch.Begin();

            lSpriteBatch.Draw(this.BackgroundTexture, Vector2.Zero, null, Color.White);

            foreach (var lButton in this.Buttons) lButton.Draw(lSpriteBatch);

            this.BackButton.Draw(lSpriteBatch);
            this.ShopButton.Draw(lSpriteBatch);

            var lHoneycombText = this.PlayerManager.Player.AvailableHoneycombToSpend.ToString();
            lSpriteBatch.DrawString(this.BasicFont, lHoneycombText, new Vector2(615, 260), Color.DarkGreen);

            lSpriteBatch.End();
        }
    }
}
