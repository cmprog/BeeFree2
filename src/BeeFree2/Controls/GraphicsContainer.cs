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
                this.Child.ApplyAlignment(this.ContentBounds);
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
