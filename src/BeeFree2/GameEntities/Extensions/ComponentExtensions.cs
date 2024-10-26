using System;
using Microsoft.Xna.Framework;
using BeeFree2.GameEntities.Movement;
using BeeFree2.GameEntities.Rendering;

namespace BeeFree2.GameEntities.Extensions
{
    public static class ComponentExtensions
    {
        /// <summary>
        /// Gets the bounding rectangle of an item which is both movable and renderable. These two interfaces ensure
        /// the item has a position and a size.
        /// </summary>
        /// <typeparam name="T">The type of item to get the bounds of.</typeparam>
        /// <param name="item">The item we're getting the bounds of.</param>
        /// <returns>A bounding rectangle for the item.</returns>
        public static Rectangle BoundingRectangle<T>(this T item) where T : IMovableEntity, IRenderableEntity
        {
            return new Rectangle(
                (int)item.Position.X,
                (int)item.Position.Y,
                (int)item.Size.X,
                (int)item.Size.Y);
        }
    }
}
