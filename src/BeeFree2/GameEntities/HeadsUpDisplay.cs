using BeeFree2.Controls;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;
using System;

namespace BeeFree2.GameEntities
{
    public sealed class HeadsUpDisplay : GraphicsContainer
    {
        private readonly Border mGraphic_HealthBar;
        private readonly Border mGraphic_HealthValue;

        private readonly TextBlock mTextBlock_LevelName;
        private readonly TextBlock mTextBlock_BirdsKilled;
        private readonly TextBlock mTextBlock_HoneycombCollected;
        private readonly TextBlock mTextBlock_CurrentHealth;
        private readonly TextBlock mTextBlock_RemainingSeconds;

        private const string sFieldLabel_BirdsKilled = "Birds Killed";
        private const string sFieldLabel_HoneycombCollected = "Honeycomb Collected";

        private const float sHealthBarScale = 12;

        private TimeSpan? mTimeRemaining;
        private float mCurrentHealth;
        private float mMaximumHealth;
        private int mBirdsKilled;
        private int mHoneycombCollected;

        public HeadsUpDisplay(ContentManager contentManager, int levelIndex)
        {
            var lFont = contentManager.Load<SpriteFont>(AssetNames.Fonts.Standard_16);
            
            this.mGraphic_HealthValue = new Border();
            this.mGraphic_HealthValue.BackgroundColor = Color.Red;
            this.mGraphic_HealthValue.HorizontalAlignment = HorizontalAlignment.Left;

            this.mGraphic_HealthBar = new Border();
            this.mGraphic_HealthBar.Height = 20;
            this.mGraphic_HealthBar.VerticalAlignment = VerticalAlignment.Center;            
            this.mGraphic_HealthBar.BackgroundTexture = contentManager.Load<Texture2D>(AssetNames.Spritesheet.Flat);
            this.mGraphic_HealthBar.BackgroundTextureScale = Spritesheets.Flat.GuageContainer_Blue;
            this.mGraphic_HealthBar.Padding = Spritesheets.Flat.GuageContainer_Blue.CornerThickness;
            this.mGraphic_HealthBar.Margin = new ThicknessF(5, 0);
            this.mGraphic_HealthBar.Add(this.mGraphic_HealthValue);

            this.mTextBlock_CurrentHealth = new TextBlock("1 / 1", lFont);

            this.mTextBlock_RemainingSeconds = new TextBlock("", lFont);

            var lHealthPanel = new HorizontalStackPanel();
            lHealthPanel.VerticalAlignment = VerticalAlignment.Top;
            lHealthPanel.Add(new TextBlock("Health", lFont));
            lHealthPanel.Add(this.mGraphic_HealthBar);
            lHealthPanel.Add(this.mTextBlock_CurrentHealth);

            this.mTextBlock_LevelName = new TextBlock();
            this.mTextBlock_LevelName.Font = lFont;
            this.mTextBlock_LevelName.HorizontalAlignment = HorizontalAlignment.Right;

            this.mTextBlock_BirdsKilled = new TextBlock();
            this.mTextBlock_BirdsKilled.Text = this.GetFieldText(sFieldLabel_BirdsKilled, 0.ToString());
            this.mTextBlock_BirdsKilled.Font = lFont;

            this.mTextBlock_HoneycombCollected = new TextBlock();
            this.mTextBlock_HoneycombCollected.Text = this.GetFieldText(sFieldLabel_HoneycombCollected, 0.ToString());
            this.mTextBlock_HoneycombCollected.Font = lFont;

            var lStatsPanel = new VerticalStackPanel();
            lStatsPanel.Margin = new ThicknessF(5);
            lStatsPanel.Add(this.mTextBlock_BirdsKilled);
            lStatsPanel.Add(this.mTextBlock_HoneycombCollected);

            var lLevelInfoPanel = new VerticalStackPanel();
            lStatsPanel.Margin = new ThicknessF(5);
            lLevelInfoPanel.Add(this.mTextBlock_LevelName);
            lLevelInfoPanel.Add(this.mTextBlock_RemainingSeconds);

            var lHudPanel = new DockPanel();
            lHudPanel.VerticalAlignment = VerticalAlignment.Top;
            lHudPanel.HorizontalAlignment = HorizontalAlignment.Stretch;
            lHudPanel.Add(lLevelInfoPanel, Dock.Right);
            lHudPanel.Add(lStatsPanel, Dock.Right);
            lHudPanel.Add(lHealthPanel);

            this.Add(lHudPanel);
        }

        public string LevelName
        {
            get => this.mTextBlock_LevelName.Text;
            set => this.mTextBlock_LevelName.Text = value;
        }

        public float CurrentHealth
        {
            get => this.mCurrentHealth;
            set
            {
                this.mCurrentHealth = value;
                this.mGraphic_HealthValue.Width = sHealthBarScale * this.CurrentHealth;
                this.UpdateCurrentHealthText();
            }
        }

        public float MaximumHealth
        {
            get => this.mMaximumHealth;
            set
            {
                this.mMaximumHealth = value;
                this.mGraphic_HealthBar.Width = sHealthBarScale * this.MaximumHealth;
                this.UpdateCurrentHealthText();
            }
        }

        public int BirdsKilled
        {
            get => this.mBirdsKilled;
            set
            {
                this.mBirdsKilled = value;
                this.mTextBlock_BirdsKilled.Text = this.GetFieldText(sFieldLabel_BirdsKilled, value.ToString("N0"));
            }
        }

        public int CoinsCollected
        {
            get => this.mHoneycombCollected;
            set
            {
                this.mHoneycombCollected = value;
                this.mTextBlock_HoneycombCollected.Text = this.GetFieldText(sFieldLabel_HoneycombCollected, value.ToString("N0"));
            }
        }

        public TimeSpan? TimeRemaining
        {
            get => this.mTimeRemaining;
            set
            {
                this.mTimeRemaining = value;
                this.mTextBlock_RemainingSeconds.Visibility = value.HasValue ? Visibility.Visible : Visibility.Hidden;

                if (value.HasValue)
                {
                    this.mTextBlock_RemainingSeconds.Text = $"{Math.Ceiling(value.Value.TotalSeconds):0}s left";
                }
            }
        }

        private void UpdateCurrentHealthText()
        {
            this.mTextBlock_CurrentHealth.Text = $"{this.CurrentHealth} / {this.MaximumHealth}";
        }

        private string GetFieldText(string fieldLabel, string fieldValue) => $"{fieldLabel}: {fieldValue}";
    }
}
