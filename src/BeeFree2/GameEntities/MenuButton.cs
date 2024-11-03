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

        private readonly DockPanel mButtonPanel;

        public MenuButton()
        {
            this.mTextBlock = new TextBlock();
            this.mTextBlock.HorizontalAlignment = HorizontalAlignment.Left;
            this.mTextBlock.VerticalAlignment = VerticalAlignment.Center;
            this.mTextBlock.ForeColor = Color.Black;
            this.mTextBlock.Margin = new Thickness(5, 0, 0, 0);

            this.mBorder = new Border();

            this.mButtonPanel = new DockPanel();
            this.mButtonPanel.Add(this.mBorder, Dock.Left);
            this.mButtonPanel.Add(this.mTextBlock);

            this.mButton = new Button(this.mButtonPanel);
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
            this.mButtonPanel.MinWidth = this.mBorder.DesiredWidth + this.mTextBlock.DesiredWidth;

            if (this.mButton.IsMouseOver)
            {
                this.mButton.BackgroundColor = Color.White;
                this.mBorder.BackgroundColor = Color.DarkGoldenrod;
            }
            else
            {
                this.mButton.BackgroundColor = Color.Gold;
                this.mBorder.BackgroundColor = Color.Transparent;
            }
        }
    }
}
