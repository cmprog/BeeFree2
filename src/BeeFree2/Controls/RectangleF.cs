using Microsoft.Xna.Framework;
using System.Runtime.CompilerServices;

namespace BeeFree2.Controls
{
    public struct RectangleF
    {
        public float X;
        public float Y;
        public float Width;
        public float Height;

        public RectangleF()
        {

        }

        public RectangleF(float x, float y, float width, float height)
        {
            this.X = x;
            this.Y = y;
            this.Width = width;
            this.Height = height;
        }

        public float Left
        {
            get => this.X;
            set => this.X = value;
        }

        public float Top
        {
            get => this.Y;
            set => this.Y = value;
        }

        public float Right
        {
            get => this.X + this.Width;
            set => this.X = value - this.Width;
        }

        public float Bottom
        {
            get => this.Y + this.Height;
            set => this.Y = value - this.Height;
        }

        public Vector2 Position
        {
            get => new(this.X, this.Y);
            set
            {
                this.X = value.X;
                this.Y = value.Y;
            }
        }

        public Vector2 TopLeft => new(this.Left, this.Top);

        public Vector2 TopRight => new(this.Right, this.Top);

        public Vector2 BottomLeft => new(this.Left, this.Bottom);

        public Vector2 BottomRight => new(this.Right, this.Bottom);

        public Vector2 Size
        {
            get => new(this.Width, this.Height);
            set
            {
                this.Width = value.X;
                this.Height = value.Y;
            }
        }

        public bool Contains(Point point) => this.Contains(point.X, point.Y);

        public bool Contains(Vector2 point) => this.Contains(point.X, point.Y);

        public bool Contains(float x, float y)
        {
            return 
                (this.Left <= x) && (x < this.Right) && 
                (this.Top <= y) && (y <= this.Bottom);
        }

        public RectangleF Intersection(RectangleF other)
        {
            var lMaxLeft = MathHelper.Max(this.Left, other.Left);
            var lMinRight = MathHelper.Min(this.Right, other.Right);

            if (lMinRight < lMaxLeft) return default;

            var lMaxTop = MathHelper.Max(this.Top, other.Top);
            var lMinBottom = MathHelper.Min(this.Bottom, other.Bottom);

            if (lMinBottom < lMaxTop) return default;

            var lResult = new RectangleF();
            lResult.X = lMaxLeft;
            lResult.Y = lMaxTop;
            lResult.Width = lMinRight - lMaxLeft;
            lResult.Height = lMinBottom - lMaxTop;
            return lResult;
        }

        public override string ToString()
            => $"{{{this.X}, {this.Y}, {this.Width}, {this.Height}}}";
    }
}
