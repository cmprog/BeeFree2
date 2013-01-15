using System;
using System.Drawing;

namespace TccLib.Drawing.Extensions
{
    public static class GraphicsExtensions
    {
        /// <summary>
        /// Draws a rectange using the given pen and the defined RectangleF structure.
        /// </summary>
        public static void DrawRectangle(this Graphics g, Pen pen, RectangleF rect)
        {
            g.DrawRectangle(pen, rect.X, rect.Y, rect.Width, rect.Height);
        }

        /// <summary>
        /// Draws a rounded rectangle using the given pen, bounding rectangle, and corner radius.
        /// </summary>
        public static void DrawRoundedRectangle(this Graphics g, Pen pen, RectangleF rect, float radius)
        {
            rect.Width--;
            rect.Height--;
            g.DrawPath(pen, rect.ToRoundedCorneredGraphicsPath(radius));
        }

        /// <summary>
        /// Fills a rounded rectangle using the given brush, bounding rectangle, and corner radius.
        /// </summary>
        public static void FillRoundedRectangle(this Graphics g, Brush brush, RectangleF rect, float radius)
        {
            rect.Width--;
            rect.Height--;
            g.FillPath(brush, rect.ToRoundedCorneredGraphicsPath(radius));
        }
    }
}
