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

        private readonly TextBlock mTextBlock_CurrentHealth;

        private readonly TextBlock mTextBlock_RemainingSeconds;

        public HeadsUpDisplay(ContentManager contentManager, int levelIndex)
        {
            var lFont = contentManager.Load<SpriteFont>(AssetNames.Fonts.Standard_16);
            
            this.mGraphic_HealthValue = new Border();
            this.mGraphic_HealthValue.BackgroundColor = Color.Red;
            this.mGraphic_HealthValue.HorizontalAlignment = HorizontalAlignment.Left;

            this.mGraphic_HealthBar = new Border();
            this.mGraphic_HealthBar.Height = 20;
            this.mGraphic_HealthBar.VerticalAlignment = VerticalAlignment.Center;
            this.mGraphic_HealthBar.Add(this.mGraphic_HealthValue);
            this.mGraphic_HealthBar.BorderColor = Color.DarkRed;
            this.mGraphic_HealthBar.BorderThickness = new Thickness(1);
            this.mGraphic_HealthBar.Margin = new Thickness(5, 0);

            this.mTextBlock_CurrentHealth = new TextBlock("1 / 1", lFont);

            this.mTextBlock_RemainingSeconds = new TextBlock("", lFont);

            var lHealthPanel = new HorizontalStackPanel();
            lHealthPanel.VerticalAlignment = VerticalAlignment.Top;
            lHealthPanel.Add(new TextBlock("Health", lFont));
            lHealthPanel.Add(this.mGraphic_HealthBar);
            lHealthPanel.Add(this.mTextBlock_CurrentHealth);

            var lLevelInfoPanel = new VerticalStackPanel();
            lLevelInfoPanel.Add(new TextBlock($"Level {(levelIndex + 1)}", lFont) { HorizontalAlignment = HorizontalAlignment.Right });
            lLevelInfoPanel.Add(this.mTextBlock_RemainingSeconds);

            var lHudPanel = new DockPanel();
            lHudPanel.VerticalAlignment = VerticalAlignment.Top;
            lHudPanel.HorizontalAlignment = HorizontalAlignment.Stretch;
            lHudPanel.Add(lLevelInfoPanel, Dock.Right);
            lHudPanel.Add(lHealthPanel);

            this.Add(lHudPanel);
        }

        public float CurrentHealth { get; set; }

        public float MaximumHealth { get; set; }

        public double RemainingSeconds { get; set; }

        public override void UpdateFinalize(GameTime gameTime)
        {
            base.UpdateFinalize(gameTime);

            const float lcHealthBarScale = 12;
            this.mGraphic_HealthBar.Width = lcHealthBarScale * this.MaximumHealth;
            this.mGraphic_HealthValue.Width = lcHealthBarScale * this.CurrentHealth;

            this.mTextBlock_RemainingSeconds.Text = $"{Math.Ceiling(this.RemainingSeconds):0}s left";
            this.mTextBlock_CurrentHealth.Text = $"{this.CurrentHealth} / {this.MaximumHealth}";
        }
    }
}
