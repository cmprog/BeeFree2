using System;
using Microsoft.Xna.Framework;

namespace BeeFree2.GameEntities.Rendering
{
    /// <summary>
    /// Defines a basic interface defining an objects which is able to be rendered.
    /// </summary>
    public interface IRenderableEntity
    {
        /// <summary>
        /// Gets the position of the entity.
        /// </summary>
        Vector2 Position { get; }

        /// <summary>
        /// Gets a vector describing the orientation of the entity.
        /// </summary>
        Vector2 Orientation { get; }

        /// <summary>
        /// Gets or sets the IRenderer which is used to render this object.
        /// </summary>
        IRenderer Renderer { get; set; }
    }
}
