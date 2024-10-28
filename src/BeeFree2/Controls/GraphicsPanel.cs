using Microsoft.Xna.Framework;
using System.Collections.Generic;

namespace BeeFree2.Controls
{
    public abstract class GraphicsPanel : GraphicsComponent, IGraphicsContainer
    {
        private readonly List<IGraphicsComponent> mChildren = new();

        public IReadOnlyList<IGraphicsComponent> Children => this.mChildren;

        public override void UpdateInitialize(GameTime gameTime)
        {
            foreach (var lChild in this.Children)
            {
                lChild.UpdateInitialize(gameTime);
            }
        }

        public override void UpdateInput(GraphicalUserInterface ui, GameTime gameTime)
        {
            foreach (var lChild in this.Children)
            {
                lChild.UpdateInput(ui, gameTime);
            }
        }

        public override void UpdateFinalize(GameTime gameTime)
        {
            foreach (var lChild in this.Children)
            {
                lChild.UpdateFinalize(gameTime);
            }
        }

        public override Vector2 MeasureCore(GameTime gameTime)
        {
            foreach (var lChild in this.Children)
            {
                lChild.Measure(gameTime);
            }

            return base.MeasureCore(gameTime);
        }

        public virtual void LayoutChildren(GameTime gameTime)
        {
            foreach (var lChild in this.Children)
            {
                if (lChild is IGraphicsContainer lContainer)
                {
                    lContainer.LayoutChildren(gameTime);
                }
            }
        }

        public override void DrawContent(GraphicalUserInterface ui, GameTime gameTime)
        {
            base.DrawContent(ui, gameTime);

            foreach (var lChild in this.Children)
            {
                lChild.Draw(ui, gameTime);
            }
        }

        public void Add(IGraphicsComponent child)
        {
            if (!this.mChildren.Contains(child))
            {
                this.mChildren.Add(child);
                child.Parent = this;                
            }
        }

        public void Remove(IGraphicsComponent child)
        {
            if (this.mChildren.Remove(child))
            {
                child.Parent = null;                
            }
        }

        public override IGraphicsComponent GetPreviousComponent()
        {
            var lComponent = this.Parent?.GetPreviousComponent(this);
            if (lComponent != null) return lComponent;

            if (this.Children.Count > 0)
            {
                return this.Children[this.Children.Count - 1].GetLastComponent();
            }

            return this;
        }

        public IGraphicsComponent GetPreviousComponent(IGraphicsComponent child)
        {
            var lIndex = this.mChildren.IndexOf(child);
            if (lIndex <= 0) return this;

            return this.Children[lIndex - 1].GetLastComponent();
        }

        public override IGraphicsComponent GetNextComponent()
        {
            if (this.Children.Count > 0)
            {
                return this.Children[0];
            }

            return this.Parent.GetNextComponent(this) ?? this;
        }

        public IGraphicsComponent GetNextComponent(IGraphicsComponent child)
        {
            var lIndex = this.mChildren.IndexOf(child);
            if ((lIndex < 0) || (lIndex >= this.Children.Count - 2))
            {
                return this.Parent?.GetNextComponent(this) ?? this;
            }

            return this.Children[lIndex + 1];
        }

        public override IGraphicsComponent GetLastComponent()
        {
            return (this.Children.Count == 0) ? this : this.Children[this.Children.Count - 1].GetLastComponent();
        }
    }
}
