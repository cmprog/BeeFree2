using BeeFree2.Controls;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;

namespace BeeFree2.GameEntities
{
    public sealed class LevelButton : GraphicsContainer
    {
        private int mLevelIndex;

        private readonly Button mButton;
        private readonly TextBlock mTextBlock;

        private readonly Image mImage_Perfect;
        private readonly Image mImage_Flawless;

        private readonly HorizontalStackPanel mBadgePanel;

        public LevelButton(ContentManager content)
        {
            this.DefaultScale = Spritesheets.Flat.Button_Blue;
            this.ActiveScale = Spritesheets.Flat.Button_Blue_Active;
            this.DisabledScale = Spritesheets.Flat.Button_Blue_Disabled;

            this.mImage_Perfect = new Image() { Color = Color.Yellow };
            this.mImage_Flawless = new Image() { Color = Color.Yellow };

            this.mBadgePanel = new HorizontalStackPanel();
            this.mBadgePanel.VerticalAlignment = VerticalAlignment.Bottom;
            this.mBadgePanel.HorizontalAlignment = HorizontalAlignment.Right;
            this.mBadgePanel.Add(this.mImage_Perfect);
            this.mBadgePanel.Add(this.mImage_Flawless);            

            this.mTextBlock = new TextBlock();
            this.mTextBlock.HorizontalAlignment = HorizontalAlignment.Center;
            this.mTextBlock.VerticalAlignment = VerticalAlignment.Center;

            this.mButton = new Button(this.mTextBlock);
            this.mButton.HorizontalAlignment = HorizontalAlignment.Stretch;
            this.mButton.VerticalAlignment = VerticalAlignment.Stretch;
            this.mButton.BackgroundTexture = content.Load<Texture2D>(AssetNames.Spritesheet.Flat);

            var lGrid = new Grid();
            lGrid.Add(this.mButton);
            lGrid.Add(this.mBadgePanel);

            this.Add(lGrid);

            this.LevelIndex = 0;
        }

        public int LevelIndex
        {
            get => this.mLevelIndex;
            set
            {
                this.mLevelIndex = value;
                this.mTextBlock.Text = (value + 1).ToString();
            }
        }

        public SpriteFont Font
        {
            get => this.mTextBlock.Font;
            set => this.mTextBlock.Font = value;
        }

        public Texture2D FlawlessTexture
        {
            get => this.mImage_Flawless.Texture;
            set => this.mImage_Flawless.Texture = value;
        }

        public Texture2D PerfectTexture
        {
            get => this.mImage_Perfect.Texture;
            set => this.mImage_Perfect.Texture = value;
        }

        public bool WasClicked => this.mButton.WasClicked;

        public bool IsUnlocked { get; set; }

        public bool IsPerfect { get; set; }

        public bool IsFlawless { get; set; }

        public BoxScale DisabledScale { get; set; }

        public BoxScale ActiveScale { get; set; }

        public BoxScale DefaultScale { get; set; }

        public override void UpdateFinalize(GameTime gameTime)
        {
            base.UpdateFinalize(gameTime);

            if (this.IsUnlocked)
            {
                this.mButton.BackgroundTextureScale = this.mButton.IsMouseOver ? this.ActiveScale : this.DefaultScale;
            }
            else
            {
                this.mButton.BackgroundTextureScale = this.DisabledScale;
            }

            this.mImage_Flawless.Visibility = this.IsFlawless ? Visibility.Visible : Visibility.Hidden;
            this.mImage_Perfect.Visibility = this.IsPerfect ? Visibility.Visible : Visibility.Hidden;
        }
    }
}
