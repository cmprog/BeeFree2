using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;
using BeeFree2.GameEntities;
using BeeFree2.EntityManagers;
using BeeFree2.ContentData;
using BeeFree2.Config;

namespace BeeFree2.GameScreens
{
    /// <summary>
    /// The ShopScreen is where you can purchase upgrades to your stuff.
    /// </summary>
    internal class ShopScreen : GameScreen
    {
        private Dictionary<int, Func<int>> PlayerUpgradeGetters { get; set; }
        private Dictionary<int, Action<int>> PlayerUpgradeSetters { get; set; }

        /// <summary>
        /// Gets or sets a lookup map of textures associated with each price.
        /// </summary>
        private Dictionary<PriceData, Texture2D> TextureByPriceData { get; set; }

        private ContentManager ContentManager { get; set; }

        private Texture2D BlankTexture { get; set; }
        
        private SpriteFont BasicFont { get; set; }
        private SpriteFont ButtonFont { get; set; }
        private SpriteFont ButtonFontBold { get; set; }
        private SpriteFont MoneyFont { get; set; }

        public Vector2 BackButtonPosition { get; set; }
        public Vector2 BackButtonSize { get; set; }

        public Vector2 AvailableMoneyPosition { get; set; }
        public Vector2 AvailableMoneySize { get; set; }

        /// <summary>
        /// Gets or sets the background texture for this screen.
        /// </summary>
        private Texture2D BackgroundTexture { get; set; }

        /// <summary>
        /// Gets or sets the PlayerManager responsible for keeping track of the player.
        /// </summary>
        public PlayerManager PlayerManager { get; set; }

        /// <summary>
        /// Gets or sets all the data related to the shop.
        /// </summary>
        private ShopData ShopData { get; set; }

        /// <summary>
        /// Gets or sets a list of buttons to use in the shop.
        /// </summary>
        private IList<ShopButtonEntity> ShopButtons { get; set; }

        /// <summary>
        /// Gets or sets the button that currently has focus.
        /// </summary>
        private ShopButtonEntity ActiveButton { get; set; }

        public ShopScreen()
        {
            this.BackButtonPosition = new Vector2(5, 426);
            this.BackButtonSize = new Vector2(130, 50);

            this.AvailableMoneyPosition = new Vector2(649, 426);
            this.AvailableMoneySize = new Vector2(146, 50);
            this.ShopButtons = new List<ShopButtonEntity>();
        }              

        public override void Activate(bool instancePreserved)
        {
            base.Activate(instancePreserved);

            this.ContentManager = this.ScreenManager.Game.Content;

            this.PlayerManager.Activate(this.ScreenManager.Game);

            this.PlayerUpgradeGetters = new Dictionary<int, Func<int>>();
            this.PlayerUpgradeGetters[1] = () => this.PlayerManager.Player.BeeSpeed;
            this.PlayerUpgradeGetters[2] = () => this.PlayerManager.Player.BeeFireRate;
            this.PlayerUpgradeGetters[3] = () => this.PlayerManager.Player.BeeDamage;
            this.PlayerUpgradeGetters[4] = () => this.PlayerManager.Player.BeeShotCount;
            this.PlayerUpgradeGetters[5] = () => this.PlayerManager.Player.BeeBulletSpeed;
            this.PlayerUpgradeGetters[6] = () => this.PlayerManager.Player.BeeHoneycombAttraction;
            this.PlayerUpgradeGetters[7] = () => this.PlayerManager.Player.BeeMaxHealth;
            this.PlayerUpgradeGetters[8] = () => this.PlayerManager.Player.BeeHeathRegen;

            this.PlayerUpgradeSetters = new Dictionary<int, Action<int>>();
            this.PlayerUpgradeSetters[1] = x => this.PlayerManager.Player.BeeSpeed = x;
            this.PlayerUpgradeSetters[2] = x => this.PlayerManager.Player.BeeFireRate = x;
            this.PlayerUpgradeSetters[3] = x => this.PlayerManager.Player.BeeDamage = x;
            this.PlayerUpgradeSetters[4] = x => this.PlayerManager.Player.BeeShotCount = x;
            this.PlayerUpgradeSetters[5] = x => this.PlayerManager.Player.BeeBulletSpeed = x;
            this.PlayerUpgradeSetters[6] = x => this.PlayerManager.Player.BeeHoneycombAttraction = x;
            this.PlayerUpgradeSetters[7] = x => this.PlayerManager.Player.BeeMaxHealth = x;
            this.PlayerUpgradeSetters[8] = x => this.PlayerManager.Player.BeeHeathRegen = x;

            this.BlankTexture = new Texture2D(this.ScreenManager.GraphicsDevice, 1, 1);
            this.BlankTexture.SetData(new[] { Color.White });

            this.BasicFont = this.ContentManager.Load<SpriteFont>("Fonts/ShopFont");
            this.ButtonFont = this.ContentManager.Load<SpriteFont>("Fonts/ShopButtonFont");
            this.ButtonFontBold = this.ContentManager.Load<SpriteFont>("Fonts/ShopButtonFontBold");
            this.MoneyFont = this.ContentManager.Load<SpriteFont>("Fonts/ShopMoneyFont");

            this.BackgroundTexture = this.ContentManager.Load<Texture2D>("Sprites/ShopBackground");

            var lConfigurationManager = this.ScreenManager.Game.Services.GetService<ConfigurationManager>();
            this.ShopData = lConfigurationManager.LoadShopData();

            this.TextureByPriceData = 
                this.ShopData.Upgrades
                    .SelectMany(x => x.Prices)
                    .ToDictionary(x => x, x => this.ContentManager.Load<Texture2D>(x.TexturePath));

            foreach (var lIndex in Enumerable.Range(1, 8))
            {
                this.ShopButtons.Add(this.CreateButton(lIndex, this.PlayerUpgradeGetters[lIndex]()));
            }
            
            this.PositionButtons();
        }

        public override void Unload()
        {
            base.Unload();
            this.PlayerManager.Unload();
        }

        /// <summary>
        /// Positions the buttons on the screen.
        /// </summary>
        private void PositionButtons()
        {
            for (int lRowIndex = 0; lRowIndex < 2; lRowIndex++)
            {
                for (int lColumnIndex = 0; lColumnIndex < 4; lColumnIndex++)
                {
                    var lButton = this.ShopButtons[(lRowIndex * 4) + lColumnIndex];
                    lButton.Position = new Vector2(30 + (lColumnIndex * (lButton.Size.X + 5)), 150 + (lRowIndex * (lButton.Size.Y + 50)));
                }
            }
        }

        /// <summary>
        /// Creates a ShopButtonEntity with the given UpgradeID.
        /// </summary>
        /// <param name="upgradeID">The ID of the Upgrade.</param>
        /// <param name="playerLevel">The level the player is currently for the given upgrade.</param>
        /// <returns>The new ShopButtonEntity</returns>
        private ShopButtonEntity CreateButton(int upgradeID, int playerLevel)
        {
            var lUpgrade = this.ShopData.Upgrades.Single(x => x.Id == upgradeID);
            var lPrice = lUpgrade.Prices.SingleOrDefault(x => x.Level == playerLevel + 1);

            var lButton = new ShopButtonEntity();
            this.LoadButton(lButton, lUpgrade, lPrice);
            return lButton;
        }

        /// <summary>
        /// Updates the button to work for the next level.
        /// </summary>
        /// <param name="button"></param>
        public void UpdateButton(ShopButtonEntity button)
        {
            var lUpgrade = this.ShopData.Upgrades.Single(x => x.Id == button.Id);
            var lPrice = lUpgrade.Prices.SingleOrDefault(x => x.Level == button.Level + 1);
            this.LoadButton(button, lUpgrade, lPrice);
        }

        /// <summary>
        /// Populates the given button with the specified upgrade and price.
        /// </summary>
        /// <param name="button">The button to populate.</param>
        /// <param name="upgrade">The upgrade to load it with.</param>
        /// <param name="price">The price to load it with.</param>
        public void LoadButton(ShopButtonEntity button, UpgradeData upgrade, PriceData price)
        {
            var lTexture = this.TextureByPriceData[price];

            button.Id = upgrade.Id;
            button.NameText = upgrade.Text;
            button.Level = price.Level;
            button.LevelText = this.GetLevelText(upgrade, price);
            button.Description = price.Description;
            button.Price = price.Price;
            button.PriceText = this.GetPriceText(upgrade, price);
            button.Font = this.ButtonFont;
            button.BoldFont = this.ButtonFontBold;
            button.IconTexture = lTexture;
            button.IconSize = new Vector2(lTexture.Width, lTexture.Height);
        }

        /// <summary>
        /// Gets the level text to display for the button with the given upgrade and price data.
        /// </summary>
        /// <param name="upgrade">The upgrade data.</param>
        /// <param name="price">The price data.</param>
        /// <returns>An appropriately formatted string.</returns>
        private string GetLevelText(UpgradeData upgrade, PriceData price)
        {
            var lLevel = price.Level;
            var lLevelMax = upgrade.Prices.Count - 1;

            if (lLevel > lLevelMax) return "ALREADY";
            else return string.Format("Level {0}/{1}", price.Level - 1, upgrade.Prices.Count - 1);
        }

        /// <summary>
        /// Gets the appropriate private text to display for the button with the given upgrade and price data.
        /// </summary>
        /// <param name="upgrade">The upgrade data.</param>
        /// <param name="price">The price data.</param>
        /// <returns>An appropriately formatted string.</returns>
        private string GetPriceText(UpgradeData upgrade, PriceData price)
        {
            var lLevel = price.Level;
            var lLevelMax = upgrade.Prices.Count - 1;

            if (lLevel > lLevelMax) return "MAXED";
            else return string.Format("{0} Honeycomb", price.Price);
        }

        public override void HandleInput(GameTime gameTime, InputState input)
        {
            base.HandleInput(gameTime, input);

            if (input.IsLeftMouseClick &&
                GraphicsUtilities.RectangleContains(this.BackButtonPosition, this.BackButtonSize, input.CurrentMouseState.X, input.CurrentMouseState.Y))
            {
                LoadingScreen.Load(this.ScreenManager, true, new LevelSelectionScreen());
            }

            this.ActiveButton = this.ShopButtons.FirstOrDefault(x => x.HitTest(input.CurrentMouseState.X, input.CurrentMouseState.Y));
            
            if (input.IsLeftMouseClick
                && (this.ActiveButton != null)
                && (this.ActiveButton.Price >= 0)
                && (this.PlayerManager.Player.AvailableHoneycombToSpend >= this.ActiveButton.Price))
            {
                this.PlayerUpgradeSetters[this.ActiveButton.Id](this.ActiveButton.Level);
                this.PlayerManager.Player.AvailableHoneycombToSpend -= this.ActiveButton.Price;
                this.PlayerManager.SavePlayer();

                this.UpdateButton(this.ActiveButton);
            }
        }

        private string WrapText(SpriteFont font, string text, float maxWidth)
        {
            var lWords = text.Split(' ');
            var lBuilder = new StringBuilder();

            var lLineWidth = 0f;
            var lSpaceWidth = font.MeasureString(" ").X;

            foreach (var lWord in lWords)
            {
                var lWordSize = font.MeasureString(lWord);

                if (lLineWidth + lWordSize.X < maxWidth)
                {
                    lBuilder.Append(lWord + " ");
                    lLineWidth += lWordSize.X + lSpaceWidth;
                }
                else
                {
                    lBuilder.Append(Environment.NewLine + lWord + " ");
                    lLineWidth = lWordSize.X + lSpaceWidth;
                }
            }

            return lBuilder.ToString();
        }

        public override void Draw(GameTime gameTime)
        {
            base.Draw(gameTime);

            this.ScreenManager.SpriteBatch.Begin();

            this.ScreenManager.SpriteBatch.Draw(this.BackgroundTexture, Vector2.Zero, Color.White);
            foreach (var lButton in this.ShopButtons) lButton.Draw(this.ScreenManager.SpriteBatch);

            if (this.ActiveButton != null)
            {
                var lText = this.WrapText(this.BasicFont, this.ActiveButton.Description, 500);
                var lTextSize = this.BasicFont.MeasureString(lText);
                this.ScreenManager.SpriteBatch.DrawString(this.BasicFont, lText, new Vector2(150, 427 + ((47 - lTextSize.Y) / 2f)), Color.White);
            }

            var lBackText = "Back";
            this.ScreenManager.SpriteBatch.DrawString(this.BasicFont, lBackText, this.BackButtonPosition + ((this.BackButtonSize - this.BasicFont.MeasureString(lBackText)) / 2f), Color.Black);

            var lHoneycombText = "Honeycomb";
            var lHoneycombTextSize = this.BasicFont.MeasureString(lHoneycombText);
            var lHoneycombTextPosition = new Vector2(this.AvailableMoneyPosition.X + (this.AvailableMoneySize.X - lHoneycombTextSize.X) / 2f, 450);

            this.ScreenManager.SpriteBatch.DrawString(this.BasicFont, lHoneycombText, lHoneycombTextPosition, Color.Black);

            var lMoneyText = this.PlayerManager.Player.AvailableHoneycombToSpend.ToString();
            var lMoneyTextSize = this.MoneyFont.MeasureString(lMoneyText);
            var lMoneyTextPosition = new Vector2(this.AvailableMoneyPosition.X + (this.AvailableMoneySize.X - lMoneyTextSize.X) / 2f, 427);

            this.ScreenManager.SpriteBatch.DrawString(this.MoneyFont, lMoneyText, lMoneyTextPosition, Color.Black);
            
            this.ScreenManager.SpriteBatch.End();
        }
    }
}
