using System;
using BeeFree2.GameEntities.Movement;
using BeeFree2.GameEntities.Rendering;
using Microsoft.Xna.Framework;

namespace BeeFree2.GameEntities
{
    /// <summary>
    /// Defines a simple entity which is just movable and renderable.
    /// </summary>
    public class SimpleGameEntity : IMovableEntity, IRenderableEntity
    {
        /// <summary>
        /// Gets the size of the entity.
        /// </summary>
        public Vector2 Size { get { return this.Renderer.Size; } }

        /// <summary>
        /// Gets a vector describing the orientation of the entity.
        /// </summary>
        public Vector2 Orientation { get { return this.MovementBehavior.Velocity; } }

        /// <summary>
        /// Gets the position of the entity.
        /// </summary>
        public Vector2 Position { get { return this.MovementBehavior.Position; } }

        /// <summary>
        /// Gets the renderer responsible for painting this entity.
        /// </summary>
        public IRenderer Renderer { get; set; }

        /// <summary>
        /// Gets the movement behavior responsible for moving this entity.
        /// </summary>
        public IMovementBehavior MovementBehavior { get; set; }
    }
}
