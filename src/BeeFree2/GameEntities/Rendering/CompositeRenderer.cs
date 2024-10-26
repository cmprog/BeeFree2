using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace BeeFree2.GameEntities.Rendering
{
    /// <summary>
    /// A CompositeRenderer is made up of multiple textures which when drawn together form a whole.
    /// </summary>
    public class CompositeRenderer : IRenderer
    {
        /// <summary>
        /// Creates the renderer with the given collection of items.
        /// </summary>
        /// <param name="items"></param>
        public CompositeRenderer(IEnumerable<CompositeRendererItem> items)
        {
            this.Items = items;
            this.Size = new Vector2(
                this.Items.Max(x => x.Size.X + x.Offset.X),
                this.Items.Max(x => x.Size.Y + x.Offset.Y));
        }

        /// <summary>
        /// Gets the collection of items which make up this renderer.
        /// </summary>
        public IEnumerable<CompositeRendererItem> Items { get; private set; }

        /// <summary>
        /// Gets the total size of the composed texture.
        /// </summary>
        public Vector2 Size { get; private set; }

        /// <summary>
        /// Renders the entity by drawing the Texture to the entity's position.
        /// </summary>
        /// <param name="entity">The entity to render.</param>
        /// <param name="spriteBatch">The SpriteBatch used to draw with.</param>
        /// <param name="gameTime">The current GameTime.</param>
        public void Render(IRenderableEntity entity, SpriteBatch spriteBatch, GameTime gameTime)
        {
            foreach (var lItem in this.Items)
            {
                spriteBatch.Draw(lItem.Texture, entity.Position + lItem.Offset, lItem.TintColor);
            }
        }
    }

    /// <summary>
    /// Represents a single item used in a CompositeRenderer.
    /// </summary>
    public class CompositeRendererItem
    {
        /// <summary>
        /// Creates a new item with the given Texture2D and Vector2 offset.
        /// </summary>
        /// <param name="texture">The texture for the component.</param>
        /// <param name="offset">The offset to draw the texture.</param>
        public CompositeRendererItem(Texture2D texture, Vector2 offset)
            : this(texture, offset, Color.White)
        {
        }

        /// <summary>
        /// Creates a new item with the given Texture2D and Vector2 offset.
        /// </summary>
        /// <param name="texture">The texture for the component.</param>
        /// <param name="offset">The offset to draw the texture.</param>
        /// <param name="tintColor">The tint color to apply to the item.</param>
        public CompositeRendererItem(Texture2D texture, Vector2 offset, Color tintColor)
        {
            this.Texture = texture;
            this.Offset = offset;
            this.Size = new Vector2(this.Texture.Width, this.Texture.Height);
            this.TintColor = tintColor;
        }

        /// <summary>
        /// Gets the size of the item.
        /// </summary>
        public Vector2 Size { get; private set; }

        /// <summary>
        /// Gets the texture to use for this item.
        /// </summary>
        public Texture2D Texture { get; private set; }
        
        /// <summary>
        /// Gets the offset to render this item.
        /// </summary>
        public Vector2 Offset { get; private set; }

        /// <summary>
        /// Gets the color to tint this texture.
        /// </summary>
        public Color TintColor { get; private set; }
    }
}
