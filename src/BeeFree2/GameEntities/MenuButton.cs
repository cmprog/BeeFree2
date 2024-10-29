using BeeFree2.Controls;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace BeeFree2.GameEntities
{
    public sealed class MenuButton : GraphicsContainer
    {
        private readonly Button mButton;
        private readonly TextBlock mTextBlock;

        public MenuButton()
        {
            this.mTextBlock = new TextBlock();
            this.mTextBlock.HorizontalAlignment = HorizontalAlignment.Center;
            this.mTextBlock.VerticalAlignment = VerticalAlignment.Center;

            this.mButton = new Button(this.mTextBlock);
            this.mButton.HorizontalAlignment = HorizontalAlignment.Stretch;
            this.mButton.VerticalAlignment = VerticalAlignment.Stretch;

            this.UpdateStyle();

            this.Add(this.mButton);
        }

        public MenuButton(string text, SpriteFont standardFont)
            : this(text, standardFont, standardFont)
        {

        }

        public MenuButton(string text, SpriteFont standardFont, SpriteFont activeFont)
            : this()
        {
            this.Text = text;
            this.StandardFont = standardFont;
            this.ActiveFont = activeFont;
        }

        public string Text
        {
            get => this.mTextBlock.Text;
            set => this.mTextBlock.Text = value;
        }

        public SpriteFont StandardFont { get; set; }

        public SpriteFont ActiveFont { get; set; }

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
                this.mTextBlock.Font = this.ActiveFont;
                this.mTextBlock.ForeColor = Color.White;

                this.mButton.BorderColor = Color.White;
                this.mButton.BorderThickness = new Thickness(6);
                this.mButton.BackgroundColor = Color.DarkGoldenrod;
            }
            else
            {
                this.mTextBlock.Font = this.StandardFont;
                this.mTextBlock.ForeColor = Color.Black;

                this.mButton.BorderColor = Color.Black;
                this.mButton.BorderThickness = new Thickness(4);
                this.mButton.BackgroundColor = Color.Gold;
            }
        }
    }
}
