using BeeFree2.Controls;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace BeeFree2.GameEntities
{
    public sealed class MenuButton : GraphicsContainer
    {
        private readonly Button mButton;
        private readonly TextBlock mTextBlock;
        private readonly Border mBorder;

        public MenuButton()
        {
            this.mTextBlock = new TextBlock();
            this.mTextBlock.HorizontalAlignment = HorizontalAlignment.Left;
            this.mTextBlock.VerticalAlignment = VerticalAlignment.Center;
            this.mTextBlock.ForeColor = Color.Black;
            this.mTextBlock.Margin = new Thickness(5);

            this.mBorder = new Border();

            var lPanel = new DockPanel();
            lPanel.Add(this.mBorder, Dock.Left);
            lPanel.Add(this.mTextBlock);

            this.mButton = new Button(lPanel);
            this.mButton.BorderThickness = new Thickness(5);
            this.mButton.HorizontalAlignment = HorizontalAlignment.Stretch;
            this.mButton.VerticalAlignment = VerticalAlignment.Stretch;
            this.mButton.BorderColor = Color.Black;

            this.UpdateStyle();

            this.Add(this.mButton);
        }

        public MenuButton(string text, SpriteFont font)
            : this()
        {

            this.Text = text;
            this.Font = font;
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
            this.mBorder.Width = this.mBorder.ActualHeight;

            if (this.mButton.IsMouseOver)
            {
                this.mButton.BackgroundColor = Color.White;
                this.mBorder.BackgroundColor = Color.Gold;
            }
            else
            {
                this.mButton.BackgroundColor = Color.Gold;
                this.mBorder.BackgroundColor = Color.Transparent;
            }
        }

        public override void LayoutChildren(GameTime gameTime)
        {
            base.LayoutChildren(gameTime);
        }
    }
}
