using Microsoft.Xna.Framework;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BeeFree2.Controls
{
    public sealed class DockPanel : GraphicsPanel
    {
        private readonly Dictionary<IGraphicsComponent, Dock> mDockPositions = new();

        public bool LastChildFill { get; set; } = true;

        public void Add(IGraphicsComponent child, Dock dock)
        {
            this.Add(child);
            this.SetDock(child, dock);
        }

        public Dock GetDock(IGraphicsComponent child)
        {
            if (!this.mDockPositions.TryGetValue(child, out var lDock))
            {
                lDock = Dock.Left;
            }

            return lDock;
        }

        public void SetDock(IGraphicsComponent child, Dock dock)
        {
            if (this.Children.Contains(child))
            {
                this.mDockPositions[child] = dock;
            }
        }

        protected override void OnChildAdded(IGraphicsComponent child)
        {
            base.OnChildAdded(child);

            this.mDockPositions[child] = Dock.Left;
        }

        protected override void OnChildRemoved(IGraphicsComponent child)
        {
            base.OnChildRemoved(child);

            this.mDockPositions.Remove(child);
        }

        public override Vector2 MeasureCore(GameTime gameTime)
        {
            base.MeasureCore(gameTime);

            if (this.Children.Count == 0) return Vector2.One;

            var lTotalWidth = 0.0f;
            var lTotalHeight = 0.0f;

            for (var lChildIndex = 0; lChildIndex < this.Children.Count; lChildIndex++)
            {
                if (this.LastChildFill && (lChildIndex == this.Children.Count - 1)) continue;

                var lChild = this.Children[lChildIndex];

                switch (this.GetDock(lChild))
                {
                    case Dock.Left:
                    case Dock.Right:
                        lTotalWidth += lChild.DesiredWidth;
                        lTotalHeight = MathHelper.Max(lChild.DesiredHeight, lTotalHeight);
                        break;

                    case Dock.Top:
                    case Dock.Bottom:
                        lTotalWidth = MathHelper.Max(lChild.DesiredWidth, lTotalWidth);
                        lTotalHeight += lChild.DesiredHeight;
                        break;
                }
            }

            if (this.LastChildFill && (this.Children.Count > 0))
            {
                var lChild = this.Children[this.Children.Count - 1];
                lTotalWidth = MathHelper.Max(lChild.DesiredWidth, lTotalWidth);
                lTotalHeight = MathHelper.Max(lChild.DesiredHeight, lTotalHeight);
            }

            return new Vector2(lTotalWidth, lTotalHeight);
        }

        public override void LayoutChildren(GameTime gameTime)
        {
            base.LayoutChildren(gameTime);

            var lContentBounds = this.ContentBounds;

            for (var lChildIndex = 0; lChildIndex < Children.Count; lChildIndex++)
            {
                if (this.LastChildFill && (lChildIndex == this.Children.Count - 1)) continue;

                var lChild = this.Children[lChildIndex];

                var lChildBounds = lContentBounds;

                switch (this.GetDock(lChild))
                {
                    case Dock.Left:
                        lChildBounds.X = lContentBounds.X;
                        lChildBounds.Y = lContentBounds.Y;
                        lChildBounds.Width = lChild.DesiredWidth;
                        lChildBounds.Height = lContentBounds.Height;

                        lContentBounds.X += lChildBounds.Width;
                        lContentBounds.Width -= lChildBounds.Width;
                        break;

                    case Dock.Right:
                        lChildBounds.X = lContentBounds.Right - lChild.DesiredWidth;
                        lChildBounds.Y = lContentBounds.Y;
                        lChildBounds.Width = lChild.DesiredWidth;
                        lChildBounds.Height = lContentBounds.Height;
                        
                        lContentBounds.Width -= lChildBounds.Width;
                        break;

                    case Dock.Top:
                        lChildBounds.X = lContentBounds.X;
                        lChildBounds.Y = lContentBounds.Y;
                        lChildBounds.Width = lContentBounds.Width;
                        lChildBounds.Height = lChild.DesiredHeight;

                        lContentBounds.Y += lChildBounds.Height;
                        lContentBounds.Height -= lChildBounds.Height;
                        break;

                    case Dock.Bottom:
                        lChildBounds.X = lContentBounds.X;
                        lChildBounds.Y = lContentBounds.Bottom - lChild.DesiredHeight;
                        lChildBounds.Width = lContentBounds.Width;
                        lChildBounds.Height = lChild.DesiredHeight;

                        lContentBounds.Height -= lChildBounds.Height;
                        break;
                }

                lChild.ApplyAlignment(lChildBounds);
                lChild.Clip = lChild.Bounds.Intersection(this.Clip);

                if (lChild is IGraphicsContainer lChildContainer)
                {
                    lChildContainer.LayoutChildren(gameTime);
                }
            }

            if (this.LastChildFill && (this.Children.Count != 0))
            {
                var lChild = this.Children[this.Children.Count - 1];

                lChild.ApplyAlignment(lContentBounds);
                lChild.Clip = lChild.Bounds.Intersection(this.Clip);

                if (lChild is IGraphicsContainer lChildContainer)
                {
                    lChildContainer.LayoutChildren(gameTime);
                }
            }
        }
    }
}
