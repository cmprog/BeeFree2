using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace BeeFree2.Controls
{
    public sealed class TextBlock : GraphicsControl
    {
        private Vector2? mCachedSize;
        private string mText;
        private SpriteFont mFont;

        public TextBlock()
        {

        }

        public TextBlock(string text, SpriteFont font)
        {
            this.Text = text;
            this.Font = font;
        }

        public string Text
        {
            get => this.mText;
            set
            {
                if (this.mText != value)
                {
                    this.mText = value;
                    this.mCachedSize = null;
                }
            }
        }

        public SpriteFont Font
        {
            get => this.mFont;
            set
            {
                if (this.mFont != value)
                {
                    this.mFont = value;
                    this.mCachedSize = null;
                }
            }
        }

        public Color ForeColor { get; set; } = Color.Black;

        public override Vector2 MeasureCore(GameTime gameTime)
        {
            if (!this.mCachedSize.HasValue)
            {
                if (!string.IsNullOrWhiteSpace(this.Text) &&
                    (this.Font != null))
                {
                    this.mCachedSize = this.Font.MeasureString(this.Text);
                }
                else
                {
                    this.mCachedSize = Vector2.Zero;
                }                
            }

            return this.mCachedSize.Value;
        }

        public override void DrawContent(GraphicalUserInterface ui, GameTime gameTime)
        {
            ui.PushScissorClip(this.Clip);

            base.DrawContent(ui, gameTime);

            if ((this.Font != null) && (this.Text != null))
            {
                ui.SpriteBatch.DrawString(this.Font, this.Text, this.ContentPosition, this.ForeColor);
            }            

            ui.PopScissorClip();
        }
    }
}
