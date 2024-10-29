using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace BeeFree2.Controls
{
    public sealed class Image : GraphicsComponent
    {
        public Image()
        {

        }

        public Image(Texture2D texture)
        {
            this.Texture = texture;
        }

        public Texture2D Texture { get; set; }

        public Color Color { get; set; } = Color.White;

        public override Vector2 MeasureCore(GameTime gameTime)
        {
            if (this.Texture == null) return Vector2.Zero;
            return new Vector2(this.Texture.Width, this.Texture.Height);
        }

        public override void DrawContent(GraphicalUserInterface ui, GameTime gameTime)
        {
            ui.PushScissorClip(this.Clip);

            base.DrawContent(ui, gameTime);

            if (this.Texture != null)
            {
                var lTextureSize = new Vector2(this.Texture.Width, this.Texture.Height);
                var lScale = (this.ActualSize / lTextureSize);

                ui.SpriteBatch.Draw(this.Texture, this.Position, null, this.Color, 0, Vector2.Zero, lScale, SpriteEffects.None, 0);
            }

            ui.PopScissorClip();
        }
    }
}
