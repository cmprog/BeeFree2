using Microsoft.Xna.Framework;

namespace BeeFree2.Controls
{
    public abstract class GraphicsComponent : IGraphicsComponent
    {
        /// <summary>
        /// Can be used to attach additional information to a component.
        /// </summary>
        /// <remarks>
        /// Sometimes this is useful when debugging when trying to get a specific instance of
        /// a <see cref="GraphicsComponent"/>.
        /// </remarks>
        public object Tag { get; set; }

        public float X { get; set; }

        public float Y { get; set; } = 0;

        public Vector2 Position
        {
            get => new(this.X, this.Y);
            set
            {
                this.X = value.X;
                this.Y = value.Y;
            }
        }

        public float DesiredWidth { get; private set; } = 0;
        public float ActualWidth { get; set; } = 0;
        public float DesiredHeight { get; private set; } = 0;
        public float ActualHeight { get; set; } = 0;

        public Vector2 DesiredSize
        {
            get => new(this.DesiredWidth, this.DesiredHeight);
            private set
            {
                this.DesiredWidth = value.X;
                this.DesiredHeight = value.Y;
            }
        }

        public Vector2 ActualSize
        {
            get => new(this.ActualWidth, this.ActualHeight);
            set
            {
                this.ActualWidth = value.X;
                this.ActualHeight = value.Y;
            }
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
            get => this.X + this.ActualWidth;
            set => this.X = value - this.ActualWidth;
        }

        public float Bottom
        {
            get => this.Y + this.ActualHeight;
            set => this.Y = value - this.ActualHeight;
        }

        public Thickness Margin { get; set; }

        public Thickness Padding { get; set; }

        public VerticalAlignment VerticalAlignment { get; set; } = VerticalAlignment.Stretch;

        public HorizontalAlignment HorizontalAlignment { get; set; } = HorizontalAlignment.Stretch;

        public bool IsFocused { get; set; } = false;
        public bool IsFocusable { get; set; } = false;

        public bool IsMouseOver { get; private set; }

        public RectangleF Bounds
        {
            get => new(this.X, this.Y, this.ActualWidth, this.ActualHeight);
            set
            {
                this.X = value.X;
                this.Y = value.Y;
                this.ActualWidth = value.Width;
                this.ActualHeight = value.Height;
            }
        }

        public RectangleF BorderBounds
        {
            get
            {
                return new RectangleF(
                    this.X + this.Margin.Left,
                    this.Y + this.Margin.Top,
                    this.ActualWidth - this.Margin.Horizontal,
                    this.ActualHeight - this.Margin.Vertical);
            }
        }

        public float ContentX => this.X + this.Margin.Left + this.BorderThickness.Left + this.Padding.Left;

        public float ConentY => this.Y + this.Margin.Top + this.BorderThickness.Top + this.Padding.Top;

        public float ContentWidth => this.ActualWidth - (this.Margin.Horizontal + this.BorderThickness.Horizontal + this.Padding.Horizontal);

        public float ContentHeight => this.ActualHeight - (this.Margin.Vertical + this.BorderThickness.Vertical + this.Padding.Vertical);

        public Vector2 ContentPosition => new Vector2(this.ContentX, this.ConentY);

        public Vector2 ContentSize => new Vector2(this.ContentWidth, this.ContentHeight);

        public RectangleF ContentBounds => new RectangleF(this.ContentX, this.ConentY, this.ContentWidth, this.ContentHeight);

        public RectangleF Clip { get; set; }

        public Color BorderColor { get; set; }

        public Color BackgroundColor { get; set; }

        public Thickness BorderThickness { get; set; }

        public IGraphicsContainer Parent { get; set; }

        public float MinWidth { get; set; } = 0;
        public float MaxWidth { get; set; } = float.PositiveInfinity;
        public float MinHeight { get; set; } = 0;
        public float MaxHeight { get; set; } = float.PositiveInfinity;

        public float Width { get; set; } = float.NaN;

        public float Height { get; set; } = float.NaN;

        public Visibility Visibility { get; set; } = Visibility.Visible;

        public virtual void UpdateInitialize(GameTime gameTime) { }
        public virtual void UpdateInput(GraphicalUserInterface ui, GameTime gameTime)
        {
            this.IsMouseOver = this.BorderBounds.Contains(ui.InputState.CurrentMouseState.Position);
        }

        public virtual void UpdateFinalize(GameTime gameTime) { }

        public void Measure(GameTime gameTime)
        {
            if (this.Visibility == Visibility.Collapsed)
            {
                this.DesiredSize = Vector2.Zero;
                return;
            }

            var lDesiredSize = this.MeasureCore(gameTime);
            
            if (double.IsNaN(this.Width))
            {
                lDesiredSize.X += this.BorderThickness.Horizontal + this.Padding.Horizontal;
            }
            else
            {
                lDesiredSize.X = this.Width;
            }

            if (double.IsNaN(this.Height))
            {
                lDesiredSize.Y += this.BorderThickness.Vertical + this.Padding.Vertical;
            }
            else
            {
                lDesiredSize.Y = this.Height;
            }

            lDesiredSize.X = MathHelper.Clamp(lDesiredSize.X, this.MinWidth, this.MaxWidth);
            lDesiredSize.Y = MathHelper.Clamp(lDesiredSize.Y, this.MinHeight, this.MaxHeight);

            lDesiredSize.X += this.Margin.Horizontal;
            lDesiredSize.Y += this.Margin.Vertical;

            this.DesiredSize = lDesiredSize;
        }

        public virtual Vector2 MeasureCore(GameTime gameTime) => Vector2.Zero;

        public void Draw(GraphicalUserInterface ui, GameTime gameTime)
        {
            if (this.Visibility != Visibility.Visible) return;

            ui.PushScissorClip(this.Clip);

            if (this.BackgroundColor != Color.Transparent)
            {
                ui.FillRectangle(this.BorderBounds, this.BackgroundColor);
            }

            if (!this.BorderThickness.IsEmpty && (this.BorderColor != Color.Transparent))
            {
                ui.DrawRectangle(this.BorderBounds, this.BorderColor, this.BorderThickness);
            }            

            this.DrawContent(ui, gameTime);

            ui.PopScissorClip();
        }

        public virtual void DrawContent(GraphicalUserInterface ui, GameTime gameTime)
        {

        }

        public virtual IGraphicsComponent GetPreviousComponent()
            => this.Parent?.GetPreviousComponent(this) ?? this;        

        public virtual IGraphicsComponent GetNextComponent()
            => this.Parent?.GetNextComponent(this) ?? this;

        public virtual IGraphicsComponent GetLastComponent() => this;

        public void ApplyAlignment(RectangleF contentBounds)
        {
            this.ApplyHorizontalAlignment(contentBounds);
            this.ApplyVerticalAlignment(contentBounds);
        }

        public void ApplyHorizontalAlignment(RectangleF contentBounds)
        {
            switch (this.HorizontalAlignment)
            {
                case HorizontalAlignment.Left:
                    this.ActualWidth = MathHelper.Min(this.DesiredWidth, contentBounds.Width);
                    this.X = contentBounds.X;
                    break;

                case HorizontalAlignment.Right:
                    this.ActualWidth = MathHelper.Min(this.DesiredWidth, contentBounds.Width);
                    this.X = contentBounds.Right - this.ActualWidth;
                    break;

                case HorizontalAlignment.Center:
                    this.ActualWidth = MathHelper.Min(this.DesiredWidth, contentBounds.Width);
                    this.X = contentBounds.X + ((contentBounds.Width - this.ActualWidth) / 2f);
                    break;

                case HorizontalAlignment.Stretch:
                    this.ActualWidth = contentBounds.Width;
                    this.X = contentBounds.X;
                    break;
            }
        }

        public void ApplyVerticalAlignment(RectangleF contentBounds)
        {
            switch (this.VerticalAlignment)
            {
                case VerticalAlignment.Top:
                    this.ActualHeight = MathHelper.Min(this.DesiredHeight, contentBounds.Height);
                    this.Y = contentBounds.Y;
                    break;

                case VerticalAlignment.Bottom:
                    this.ActualHeight = MathHelper.Min(this.DesiredHeight, contentBounds.Height);
                    this.Y = contentBounds.Bottom - this.ActualHeight;
                    break;

                case VerticalAlignment.Center:
                    this.ActualHeight = MathHelper.Min(this.DesiredHeight, contentBounds.Height);
                    this.Y = contentBounds.Y + ((contentBounds.Height - this.ActualHeight) / 2f);
                    break;

                case VerticalAlignment.Stretch:
                    this.ActualHeight = contentBounds.Height;
                    this.Y = contentBounds.Y;
                    break;
            }
        }
    }
}
