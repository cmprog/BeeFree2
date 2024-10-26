using System;
using System.Collections.Generic;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace BeeFree2.GameEntities.Rendering
{
    public class AnimatedRenderer : IRenderer
    {
        /// <summary>
        /// Creates the BasicRenderer with the given Texture2D.
        /// </summary>
        /// <param name="texture"></param>
        public AnimatedRenderer(IList<Texture2D> textures)
        {
            this.Textures = textures;
            this.CurrentTextureIndex = 0;
        }

        /// <summary>
        /// Gets the list of textures used in the animation.
        /// </summary>
        public IList<Texture2D> Textures { get; private set; }

        /// <summary>
        /// Gets the index of the current texture used in the animation.
        /// </summary>
        public int CurrentTextureIndex { get; private set; }

        /// <summary>
        /// Gets the current texture used in the animation.
        /// </summary>
        public Texture2D CurrentTexture { get { return this.Textures[this.CurrentTextureIndex]; } }
        
        /// <summary>
        /// Gets the size of the renderer.
        /// </summary>
        public Vector2 Size { get { return new Vector2(this.CurrentTexture.Width, this.CurrentTexture.Height); } }

        /// <summary>
        /// Renders the entity by drawing the Texture to the entity's position.
        /// </summary>
        /// <param name="entity">The entity to render.</param>
        /// <param name="spriteBatch">The SpriteBatch used to draw with.</param>
        /// <param name="gameTime">The current GameTime.</param>
        public void Render(IRenderableEntity entity, SpriteBatch spriteBatch, GameTime gameTime)
        {
            spriteBatch.Draw(this.CurrentTexture, entity.Position, Color.White);
                
            this.CurrentTextureIndex++;
            if (this.CurrentTextureIndex == this.Textures.Count)
            {
                this.CurrentTextureIndex = 0;
            }
        }
    }
}
