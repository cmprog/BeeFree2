using System;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace BeeFree2.GameEntities.Rendering
{
    /// <summary>
    /// This simple renderer simply draws a single texture at the position of the entity.
    /// </summary>
    public class BasicRenderer : IRenderer
    {
        /// <summary>
        /// Creates the BasicRenderer with the given Texture2D.
        /// </summary>
        /// <param name="texture"></param>
        public BasicRenderer(Texture2D texture)
            : this(texture, 1f)
        {
        }

        /// <summary>
        /// Creates the BasicRenderer with the given Texture2D.
        /// </summary>
        /// <param name="texture"></param>
        /// <param name="scale">The amount to scale.</param>
        public BasicRenderer(Texture2D texture, float scale)
        {
            this.Texture = texture;
            this.Size = new Vector2(this.Texture.Width, this.Texture.Height);
            this.Scale = new Vector2(scale, scale);
        }

        /// <summary>
        /// Gets the texture used to render the entity.
        /// </summary>
        public Texture2D Texture { get; private set; }

        /// <summary>
        /// Gets the size of the renderer.
        /// </summary>
        public Vector2 Size { get; private set; }

        /// <summary>
        /// Gets the scale factor used to render the texture.
        /// </summary>
        public Vector2 Scale { get; private set; }

        /// <summary>
        /// Renders the entity by drawing the Texture to the entity's position.
        /// </summary>
        /// <param name="entity">The entity to render.</param>
        /// <param name="spriteBatch">The SpriteBatch used to draw with.</param>
        /// <param name="gameTime">The current GameTime.</param>
        public void Render(IRenderableEntity entity, SpriteBatch spriteBatch, GameTime gameTime)
        {
            spriteBatch.Draw(this.Texture, entity.Position, null, Color.White, 0, Vector2.Zero, this.Scale, SpriteEffects.None, 1);
        }
    }
}
