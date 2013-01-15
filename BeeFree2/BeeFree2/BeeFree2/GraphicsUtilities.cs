using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Xna.Framework;

namespace BeeFree2
{
    /// <summary>
    /// Simple static class containing various utility functions for working with graphics.
    /// </summary>
    public static class GraphicsUtilities
    {
        /// <summary>
        /// Checks whether or not the point at the given (x, y) falls within the bounds of
        /// a rectangle with the given position and size.
        /// </summary>
        /// <param name="position">The position of the rectangle.</param>
        /// <param name="size">The size of the rectangle.</param>
        /// <param name="x">The x-coordinate of the point.</param>
        /// <param name="y">The y-coordinate of the point.</param>
        /// <returns>True if the point falls in the rectangle, false otherwise.</returns>
        public static bool RectangleContains(Vector2 position, Vector2 size, float x, float y)
        {
            return (x >= position.X) && (x <= position.X + size.X)
                && (y >= position.Y) && (y <= position.Y + size.Y);
        }

        /// <summary>
        /// Checks whether two objects collide. This method assumes both objects are
        /// circles with the given positions and radii.
        /// </summary>
        /// <param name="position1">The position of the first object.</param>
        /// <param name="radius1">The radius of the first object.</param>
        /// <param name="position2">The position of the second object.</param>
        /// <param name="radius2">The radius of the second object.</param>
        /// <returns></returns>
        public static bool CircleCollides(Vector2 position1, float radius1, Vector2 position2, float radius2)
        {
            return Vector2.DistanceSquared(position1, position2) < ((radius1 + radius2) * (radius1 + radius2));
        }
    }
}
