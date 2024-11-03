using BeeFree2.Controls;
using BeeFree2.EntityManagers;
using BeeFree2.GameEntities;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BeeFree2.GameScreens
{
    public sealed class LoadGameScreen : GameScreen
    {
        private GraphicalUserInterface mUserInterface;

        private int mCurrentPageIndex = 0;
        private int mPageCount = 0;
        private readonly int mPlayersPerPage = 5;

        private readonly List<LoadPlayerButton> mPlayerButtons_All = new();
        private readonly List<LoadPlayerButton> mPlayerButtons_Current = new();

        private MenuButton mMenuButton_NextPage;
        private MenuButton mMenuButton_PreviousPage;
        private MenuButton mMenuButton_ReturnToMenu;

        private TextBlock mTextBlock_CurrentPage;

        private VerticalStackPanel mPanel_PlayerButtons;

        public override void Activate(bool instancePreserved)
        {
            base.Activate(instancePreserved);

            var lFont = this.ScreenManager.Game.Content.Load<SpriteFont>(AssetNames.Fonts.Standard_14);

            this.mMenuButton_ReturnToMenu = new MenuButton("Back", lFont);
            this.mMenuButton_ReturnToMenu.HorizontalAlignment = HorizontalAlignment.Left;
            this.mMenuButton_ReturnToMenu.Margin = new Thickness(5);

            this.mMenuButton_NextPage = new MenuButton("Next", lFont);
            this.mMenuButton_PreviousPage = new MenuButton("Previous", lFont);

            this.mTextBlock_CurrentPage = new TextBlock("Page 1", lFont);
            this.mTextBlock_CurrentPage.HorizontalAlignment = HorizontalAlignment.Center;

            var lNavigationPanel = new DockPanel();
            lNavigationPanel.Add(this.mMenuButton_PreviousPage, Dock.Left);
            lNavigationPanel.Add(this.mMenuButton_NextPage, Dock.Right);
            lNavigationPanel.Add(this.mTextBlock_CurrentPage);
            
            this.mPanel_PlayerButtons = new VerticalStackPanel();

            var lPersistanceManager = this.ScreenManager.Game.Services.GetService<GamePersistanceService>();

            foreach (var lPlayer in lPersistanceManager.GetAllPlayers().OrderByDescending(x => x.LastPlayedOn))
            {
                this.mPlayerButtons_All.Add(new LoadPlayerButton(lPlayer, lFont));
            }

            this.mPageCount = 1 + ((this.mPlayerButtons_All.Count - 1) / this.mPlayersPerPage);

            var lCentralPanel = new VerticalStackPanel();
            lCentralPanel.Margin = new Thickness(40, 40);
            lCentralPanel.Add(lNavigationPanel);
            lCentralPanel.Add(this.mPanel_PlayerButtons);

            var lScreenPanel = new DockPanel();
            lScreenPanel.Add(this.mMenuButton_ReturnToMenu, Dock.Bottom);
            lScreenPanel.Add(lCentralPanel);

            this.mUserInterface = new GraphicalUserInterface(this);
            this.mUserInterface.Add(lScreenPanel);

            this.LoadPage(0);
        }

        private void LoadPage(int pageIndex)
        {
            this.mCurrentPageIndex = Math.Clamp(pageIndex, 0, (this.mPageCount == 0 ? 0 : this.mPageCount - 1));
            this.mTextBlock_CurrentPage.Text = $"Page {(this.mCurrentPageIndex + 1)}";

            this.mMenuButton_NextPage.Visibility = (this.mCurrentPageIndex == this.mPageCount - 1) ? Visibility.Hidden : Visibility.Visible;
            this.mMenuButton_PreviousPage.Visibility = (this.mCurrentPageIndex == 0) ? Visibility.Hidden : Visibility.Visible;

            this.mPlayerButtons_Current.Clear();
            var lPageStart = this.mCurrentPageIndex * this.mPlayersPerPage;
            var lPageEnd = Math.Min(lPageStart + this.mPlayersPerPage, this.mPlayerButtons_All.Count);

            for (var lPlayerIndex = lPageStart; lPlayerIndex < lPageEnd; lPlayerIndex++)
            {
                this.mPlayerButtons_Current.Add(this.mPlayerButtons_All[lPlayerIndex]);
            }

            this.mPanel_PlayerButtons.Clear();
            foreach (var lButton in this.mPlayerButtons_Current)
            {
                this.mPanel_PlayerButtons.Add(lButton);
            }
        }

        public override void Update(GameTime gameTime, bool otherScreenHasFocus, bool coveredByOtherScreen)
        {
            base.Update(gameTime, otherScreenHasFocus, coveredByOtherScreen);

            

            this.mUserInterface.Update(gameTime, !otherScreenHasFocus && !coveredByOtherScreen);
        }

        public override void HandleInput(GameTime gameTime, InputState input)
        {
            base.HandleInput(gameTime, input);

            if (this.mMenuButton_ReturnToMenu.WasClicked)
            {
                LoadingScreen.Load(this.ScreenManager, false, new MainMenuScreen());
            }
            else if (this.mMenuButton_PreviousPage.WasClicked)
            {
                if (this.mCurrentPageIndex > 0)
                {
                    this.LoadPage(this.mCurrentPageIndex - 1);
                }
            }
            else if (this.mMenuButton_NextPage.WasClicked)
            {
                if (this.mCurrentPageIndex < this.mPageCount - 1)
                {
                    this.LoadPage(this.mCurrentPageIndex + 1);
                }
            }
            else
            {
                foreach (var lPlayerButton in this.mPlayerButtons_Current)
                {
                    if (lPlayerButton.WasClicked)
                    {
                        var lPlayerManager = this.ScreenManager.Game.Services.GetService<PlayerManager>();

                        lPlayerManager.LoadPlayer(lPlayerButton.SaveSlot);
                        LoadingScreen.Load(this.ScreenManager, false, new LevelSelectionScreen());
                        break;
                    }
                }
            }
        }

        public override void Draw(GameTime gameTime)
        {
            base.Draw(gameTime);
            this.mUserInterface.Draw(gameTime);
        }

        private sealed class LoadPlayerButton : GraphicsContainer
        {
            private readonly Player mPlayer;
            private readonly Button mButton;

            private readonly TextBlock mTextBlock_CreatedOn;
            private readonly TextBlock mTextBlock_LastPlayedOn;

            public LoadPlayerButton(Player player, SpriteFont font)
            {
                this.mPlayer = player;

                var lCurrentTime = DateTime.UtcNow;

                var lRightPanel = new VerticalStackPanel();
                lRightPanel.Add(new TextBlock($"Honeycomb: {player.AvailableHoneycombToSpend:N0}", font));
                lRightPanel.Add(new TextBlock($"Levels: {player.LevelsAvailable:N0}", font));

                this.mTextBlock_CreatedOn = new TextBlock(string.Empty, font);
                this.mTextBlock_LastPlayedOn = new TextBlock(string.Empty, font);

                var lMainPanel = new VerticalStackPanel();
                lMainPanel.Add(this.mTextBlock_CreatedOn);
                lMainPanel.Add(this.mTextBlock_LastPlayedOn);

                var lButtonPanel = new DockPanel();
                lButtonPanel.Add(lRightPanel, Dock.Right);
                lButtonPanel.Add(lMainPanel);

                this.mButton = new Button();
                this.mButton.BackgroundColor = new Color(1, 1, 1, 0.75f);
                this.mButton.Padding = new Thickness(5);
                this.mButton.Add(lButtonPanel);

                this.Add(this.mButton);
            }

            public SaveSlot SaveSlot => this.mPlayer.SaveSlot;

            public bool WasClicked => this.mButton.WasClicked;

            public override void UpdateFinalize(GameTime gameTime)
            {
                base.UpdateFinalize(gameTime);

                var lCurrentTime = DateTime.UtcNow;
                this.mTextBlock_CreatedOn.Text = $"Created: {this.ToHumanString(lCurrentTime, this.mPlayer.CreatedOn)}";
                this.mTextBlock_LastPlayedOn.Text = $"Last Played: {this.ToHumanString(lCurrentTime, this.mPlayer.LastPlayedOn)}";
            }

            public string ToHumanString(DateTime currentDateTime, DateTime dt)
            {
                var lDelta = currentDateTime - dt;

                if (lDelta < TimeSpan.FromSeconds(1)) return "just now";

                if (lDelta < TimeSpan.FromMinutes(1))
                {
                    if (lDelta.Seconds == 1) return "one second ago";
                    return $"{lDelta.Seconds} seconds ago";
                }

                if (lDelta < TimeSpan.FromMinutes(2)) return "a minute ago";

                if (lDelta < TimeSpan.FromMinutes(45)) return $"{lDelta.Minutes} minutes ago";
                if (lDelta < TimeSpan.FromMinutes(90)) return "an hour ago";
                if (lDelta < TimeSpan.FromDays(1)) return $"{lDelta.Hours} hours ago";

                if (lDelta < TimeSpan.FromDays(1.5)) return "a day ago";
                if (lDelta < TimeSpan.FromDays(6)) return $"{lDelta.Days} days ago";

                return dt.ToString("d");
            }
        }
    }
}
