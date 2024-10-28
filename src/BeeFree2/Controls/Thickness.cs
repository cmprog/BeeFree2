namespace BeeFree2.Controls
{
    public struct Thickness
    {
        public Thickness()
        {

        }
        public Thickness(float v)
        {
            this.Left = v;
            this.Top = v;
            this.Right = v;
            this.Bottom = v;
        }

        public Thickness(float horizontal, float vertical)
        {
            this.Left = horizontal;
            this.Top = vertical;
            this.Right = horizontal;
            this.Bottom = vertical;
        }

        public Thickness(float left, float top, float right, float bottom)
        {
            this.Left = left;
            this.Top = top;
            this.Right = right;
            this.Bottom = bottom;
        }

        public float Left;
        public float Top;
        public float Right;
        public float Bottom;

        public float Horizontal => this.Left + this.Right;

        public float Vertical => this.Top + this.Bottom;

        public bool IsEmpty
        {
            get
            {
                return 
                    (this.Left == 0) && (this.Right == 0) &&
                    (this.Top == 0) && (this.Bottom == 0);
            }
        }
    }
}
