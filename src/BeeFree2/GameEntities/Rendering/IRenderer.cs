using System;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace BeeFree2.GameEntities.Rendering
{
    /// <summary>
    /// Defines a basic interface for an objects which renders something.
    /// </summary>
    public interface IRenderer
    {
        /// <summary>
        /// Gets the size of the renderer.
        /// </summary>
        Vector2 Size { get; }

        /// <summary>
        /// Renders the given entity using the SpriteBatch and GameTime specified.
        /// </summary>
        /// <param name="entity">The entity to render.</param>
        /// <param name="spriteBatch">The SpriteBatch to render with.</param>
        /// <param name="gameTime">The current GameTime for the game.</param>
        void Render(IRenderableEntity entity, SpriteBatch spriteBatch, GameTime gameTime);
    }
}
