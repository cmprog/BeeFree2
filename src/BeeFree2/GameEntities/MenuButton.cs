using BeeFree2.Controls;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;

namespace BeeFree2.GameEntities
{
    public sealed class MenuButton : GraphicsContainer
    {
        private readonly Button mButton;
        private readonly TextBlock mTextBlock;

        private readonly BoxScale mDisabledScale;
        private readonly BoxScale mActiveScale;
        private readonly BoxScale mDefaultScale;

        public MenuButton()
        {
            this.mTextBlock = new TextBlock();
            this.mTextBlock.HorizontalAlignment = HorizontalAlignment.Center;
            this.mTextBlock.VerticalAlignment = VerticalAlignment.Center;
            this.mTextBlock.ForeColor = Color.Black;

            this.mButton = new Button(this.mTextBlock);
            this.mButton.HorizontalAlignment = HorizontalAlignment.Stretch;
            this.mButton.VerticalAlignment = VerticalAlignment.Stretch;

            this.UpdateStyle();

            this.Add(this.mButton);
        }

        public MenuButton(ContentManager content, string text, SpriteFont font)
            : this()
        {
            this.Text = text;
            this.Font = font;

            this.mButton.BackgroundTexture = content.Load<Texture2D>(AssetNames.Spritesheet.Flat);

            this.mDefaultScale = Spritesheets.Flat.Button_Gold;
            this.mActiveScale = Spritesheets.Flat.Button_Gold_Active;
        }

        public string Text
        {
            get => this.mTextBlock.Text;
            set => this.mTextBlock.Text = value;
        }

        public SpriteFont Font
        {
            get => this.mTextBlock.Font;
            set => this.mTextBlock.Font = value;
        }

        public bool WasClicked => this.mButton.WasClicked;

        public override void UpdateFinalize(GameTime gameTime)
        {
            base.UpdateFinalize(gameTime);
            this.UpdateStyle();
        }

        private void UpdateStyle()
        {                                    
            if (this.mButton.IsMouseOver)
            {
                this.mButton.BackgroundTextureScale = this.mActiveScale;
            }
            else
            {
                this.mButton.BackgroundTextureScale = this.mDefaultScale;
            }
        }
    }
}
