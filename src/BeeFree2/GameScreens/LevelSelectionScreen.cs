using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using BeeFree2.GameEntities;
using BeeFree2.EntityManagers;
using BeeFree2.Controls;
using System.Collections.Generic;

namespace BeeFree2.GameScreens
{
    /// <summary>
    /// This screen allows the user to select the level they want to play. It also lets them shop and
    /// view some of their information.
    /// </summary>
    internal sealed class LevelSelectionScreen : GameScreen
    {
        private MenuButton mMenuButton_Back;
        private MenuButton mMenuButton_Shop;
        private MenuButton mMenuButton_Endless;

        private GraphicalUserInterface mUserInterface;

        private PlayerManager mPlayerManager;

        private readonly List<LevelButton> mLevelButtons = new();
        
        public override void Activate(bool instancePreserved)
        {
            base.Activate(instancePreserved);

            this.mPlayerManager = this.ScreenManager.Game.Services.GetService<PlayerManager>();

            var lStandardFont = this.ScreenManager.Game.Content.Load<SpriteFont>(AssetNames.Fonts.Standard_16);

            var lPerfectTexture = this.ScreenManager.Game.Content.Load<Texture2D>(AssetNames.Sprites.Perfect);
            var lFlawlessTexture = this.ScreenManager.Game.Content.Load<Texture2D>(AssetNames.Sprites.Flawless);

            var lUniformGrid = new UniformGrid();
            lUniformGrid.HorizontalAlignment = HorizontalAlignment.Left;
            lUniformGrid.VerticalAlignment = VerticalAlignment.Center;
            lUniformGrid.ColumnCount = 5;
            lUniformGrid.RowCount = 4;

            for (int lRowIndex = 0; lRowIndex < lUniformGrid.RowCount; lRowIndex++)
            {
                for (int lColumnIndex = 0; lColumnIndex < lUniformGrid.ColumnCount; lColumnIndex++)
                {
                    var lLevelIndex = (lRowIndex * 5) + lColumnIndex;
                    
                    var lButton = new LevelButton();
                    lButton.LevelIndex = lLevelIndex;
                    lButton.BorderThickness = new Thickness(2);
                    lButton.BorderColor = Color.Black;
                    lButton.Margin = new Thickness(5);
                    lButton.Width = 75;
                    lButton.Height = 75;

                    lButton.Font = lStandardFont;

                    var lLevelData = this.mPlayerManager.Player.GetLevelData(lLevelIndex);

                    lButton.IsUnlocked = lLevelData.IsAvailable;

                    lButton.IsFlawless = lLevelData.CompletedFlawlessly;
                    lButton.FlawlessTexture = lFlawlessTexture;

                    lButton.IsPerfect = lLevelData.CompletedPerfectly;
                    lButton.PerfectTexture = lPerfectTexture;

                    lUniformGrid.Add(lButton);

                    this.mLevelButtons.Add(lButton);
                }
            }

            var lInfoPanel = new VerticalStackPanel();
            lInfoPanel.Add(new Logo(this.ScreenManager.Game.Content) { HorizontalAlignment = HorizontalAlignment.Center });
            lInfoPanel.Add(new TextBlock("Earn honeycomb as you play", lStandardFont));
            lInfoPanel.Add(new TextBlock("and then check out the shop.", lStandardFont));
            lInfoPanel.Add(new TextBlock($"Honeycomb {this.mPlayerManager.Player.AvailableHoneycombToSpend}", lStandardFont));

            var lTopPanel = new DockPanel();
            lTopPanel.Add(lUniformGrid, Dock.Left);
            lTopPanel.Add(lInfoPanel);

            this.mMenuButton_Back = new MenuButton("Back", lStandardFont);
            this.mMenuButton_Back.Margin = new Thickness(10);
            this.mMenuButton_Back.Width = 150;
            this.mMenuButton_Back.Height = 50;

            this.mMenuButton_Shop = new MenuButton("Shop", lStandardFont);
            this.mMenuButton_Shop.Margin = new Thickness(10);
            this.mMenuButton_Shop.Width = 150;
            this.mMenuButton_Shop.Height = 50;

            var lButtonPanel = new HorizontalStackPanel();
            lButtonPanel.Add(this.mMenuButton_Back);
            lButtonPanel.Add(this.mMenuButton_Shop);

            this.mMenuButton_Endless = new MenuButton("Endless", lStandardFont);
            this.mMenuButton_Endless.Margin = new Thickness(10);
            this.mMenuButton_Endless.HorizontalAlignment = HorizontalAlignment.Right;
            this.mMenuButton_Endless.Width = 150;
            this.mMenuButton_Endless.Height = 50;

            var lVerticalButtonPanel = new VerticalStackPanel();
            lVerticalButtonPanel.Add(this.mMenuButton_Endless);
            lVerticalButtonPanel.Add(lButtonPanel);

            var lBottomInfoPanel = new VerticalStackPanel();
            lBottomInfoPanel.Add(new TextBlock("Choose a level to begin.", lStandardFont));
            lBottomInfoPanel.Add(new TextBlock("Don't worry, you can replay levels.", lStandardFont));

            var lBottomPanel = new DockPanel();
            lBottomPanel.Add(lVerticalButtonPanel, Dock.Right);
            lBottomPanel.Add(lBottomInfoPanel);

            var lScreenPanel = new DockPanel();
            lScreenPanel.BackgroundColor = Color.SkyBlue;
            lScreenPanel.HorizontalAlignment = HorizontalAlignment.Stretch;
            lScreenPanel.VerticalAlignment = VerticalAlignment.Stretch;
            lScreenPanel.Add(lBottomPanel, Dock.Bottom);
            lScreenPanel.Add(lTopPanel);

            this.mUserInterface = new GraphicalUserInterface(this);
            this.mUserInterface.Add(lScreenPanel);
        }

        public override void HandleInput(GameTime gameTime, InputState input)
        {
            base.HandleInput(gameTime, input);

            if (this.mMenuButton_Back.WasClicked)
            {
                LoadingScreen.Load(this.ScreenManager, false, new MainMenuScreen());
            }
            else if (this.mMenuButton_Shop.WasClicked)
            {
                LoadingScreen.Load(this.ScreenManager, true, new ShopScreen());
            }
            else if (this.mMenuButton_Endless.WasClicked)
            {
                var lGameplayScreen = new GameplayScreen(x => new EndlessGameplayProvider(x));
                LoadingScreen.Load(this.ScreenManager, true, lGameplayScreen);
            }
            else
            {
                foreach (var lLevelButton in this.mLevelButtons)
                {
                    if (lLevelButton.WasClicked)
                    {
                        var lGameplayScreen = new GameplayScreen(x => new StandardGameplayProvider(x, lLevelButton.LevelIndex));

                        this.mPlayerManager.Player.MarkLevelPlayed(lLevelButton.LevelIndex);
                        this.mPlayerManager.SavePlayer();

                        LoadingScreen.Load(this.ScreenManager, true, lGameplayScreen);

                        return;
                    }
                }
            }
        }

        public override void Update(GameTime gameTime, bool otherScreenHasFocus, bool coveredByOtherScreen)
        {
            base.Update(gameTime, otherScreenHasFocus, coveredByOtherScreen);
            this.mUserInterface.Update(gameTime, !otherScreenHasFocus && !coveredByOtherScreen);
        }

        public override void Draw(GameTime gameTime)
        {
            base.Draw(gameTime);

            this.mUserInterface.Draw(gameTime);
        }
    }
}
