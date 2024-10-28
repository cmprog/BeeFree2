using Microsoft.Xna.Framework;

namespace BeeFree2.Controls
{
    public abstract class GraphicsContainer : GraphicsComponent, IGraphicsContainer
    {
        public IGraphicsComponent Child { get; private set; }

        public override void UpdateInitialize(GameTime gameTime)
            => this.Child?.UpdateInitialize(gameTime);

        public override void UpdateInput(GraphicalUserInterface ui, GameTime gameTime)
        {
            base.UpdateInput(ui, gameTime);
            this.Child?.UpdateInput(ui, gameTime);
        }

        public override void UpdateFinalize(GameTime gameTime)
            => this.Child?.UpdateFinalize(gameTime);

        public override void DrawContent(GraphicalUserInterface ui, GameTime gameTime)
            => this.Child?.Draw(ui, gameTime);

        public override Vector2 MeasureCore(GameTime gameTime)
        {
            if (this.Child != null)
            {
                this.Child.Measure(gameTime);
                return this.Child.DesiredSize;
            }

            return Vector2.Zero;
        }

        public virtual void LayoutChildren(GameTime gameTime)
        {
            if (this.Parent != null)
            {
                this.Clip = this.Bounds.Intersection(this.Parent.Bounds);
            }

            if (this.Child != null)
            {
                var lContentBounds = this.ContentBounds;

                switch (this.Child.HorizontalAlignment)
                {
                    case HorizontalAlignment.Left:
                        this.Child.ActualWidth = MathHelper.Min(this.Child.DesiredWidth, lContentBounds.Width);
                        this.Child.X = lContentBounds.X;
                        break;

                    case HorizontalAlignment.Right:
                        this.Child.ActualWidth = MathHelper.Min(this.Child.DesiredWidth, lContentBounds.Width);
                        this.Child.X = lContentBounds.X + this.Child.ActualWidth;
                        break;

                    case HorizontalAlignment.Center:
                        this.Child.ActualWidth = MathHelper.Min(this.Child.DesiredWidth, lContentBounds.Width);
                        this.Child.X = lContentBounds.X + ((lContentBounds.Width - this.Child.ActualWidth) / 2f);
                        break;

                    case HorizontalAlignment.Stretch:
                        this.Child.ActualWidth = lContentBounds.Width;
                        this.Child.X = lContentBounds.X;
                        break;
                }

                switch (this.Child.VerticalAlignment)
                {
                    case VerticalAlignment.Top:
                        this.Child.ActualHeight = MathHelper.Min(this.Child.DesiredHeight, lContentBounds.Height);
                        this.Child.Y = lContentBounds.Y;                        
                        break;

                    case VerticalAlignment.Bottom:
                        this.Child.ActualHeight = MathHelper.Min(this.Child.DesiredHeight, lContentBounds.Height);
                        this.Child.Y = lContentBounds.Y + this.Child.ActualHeight;
                        break;

                    case VerticalAlignment.Center:
                        this.Child.ActualHeight = MathHelper.Min(this.Child.DesiredHeight, this.ActualHeight);
                        this.Child.Y = lContentBounds.Y + ((lContentBounds.Height - this.Child.ActualHeight) / 2f);
                        break;

                    case VerticalAlignment.Stretch:
                        this.Child.ActualHeight = lContentBounds.Height;
                        this.Child.Y = lContentBounds.Y;
                        break;
                }
            }

            if (this.Child is IGraphicsContainer lChildContainer)
            {
                lChildContainer.LayoutChildren(gameTime);
            }
        }

        public void Add(IGraphicsComponent child)
        {
            if (child != this.Child)
            {
                if (this.Child != null)
                {
                    this.Child.Parent = null;
                }

                var lPreviousChild = this.Child;

                this.Child = child;
                this.Child.Parent = this;
            }
        }

        public void Remove(IGraphicsComponent child)
        {
            if (this.Child == child)
            {
                this.Child.Parent = null;
                this.Child = null;
            }
        }

        public override IGraphicsComponent GetNextComponent()
            => this.Child ?? this.Parent?.GetNextComponent(this) ?? this;

        public IGraphicsComponent GetNextComponent(IGraphicsComponent child)
            => this.Parent?.GetNextComponent(this) ?? this;

        public override IGraphicsComponent GetPreviousComponent()
            => this.Parent?.GetPreviousComponent(this) ?? this.Child?.GetLastComponent() ?? this;

        public IGraphicsComponent GetPreviousComponent(IGraphicsComponent child)
            => this;

        public override IGraphicsComponent GetLastComponent()
            => this.Child?.GetLastComponent() ?? this;
    }
}
