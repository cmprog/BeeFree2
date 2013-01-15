using System;
using System.Drawing;
using System.Drawing.Drawing2D;

namespace TccLib.Drawing.Extensions
{
    public static class RectangleExtensions
    {
        public static GraphicsPath ToRoundedCorneredGraphicsPath(this RectangleF rect, float radius)
        {
            var lGraphicsPath = new GraphicsPath();
            lGraphicsPath.AddArc(rect.Left, rect.Top, radius, radius, 180, 90);
            lGraphicsPath.AddArc(rect.Left + rect.Width - radius, rect.Top, radius, radius, 270, 90);
            lGraphicsPath.AddArc(rect.Left + rect.Width - radius, rect.Top + rect.Height - radius, radius, radius, 0, 90);
            lGraphicsPath.AddArc(rect.Left, rect.Top + rect.Height - radius, radius, radius, 90, 90);
            lGraphicsPath.CloseAllFigures();

            return lGraphicsPath;
        }
    }
}
