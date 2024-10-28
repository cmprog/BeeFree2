﻿using Microsoft.Xna.Framework;

namespace BeeFree2.Controls
{
    public sealed class Button : GraphicsContainer
    {
        public Button()
        {

        }

        public Button(IGraphicsComponent componet)
        {
            this.Add(componet);
        }

        public bool WasClicked { get; private set; }

        public override Vector2 MeasureCore(GameTime gameTime)
        {
            var lDesiredSize = base.MeasureCore(gameTime);
            lDesiredSize.X += this.BorderThickness.Horizontal;
            lDesiredSize.Y += this.BorderThickness.Vertical;
            return lDesiredSize;
        }

        public override void LayoutChildren(GameTime gameTime)
        {
            base.LayoutChildren(gameTime);

            this.Child.X += this.BorderThickness.Left;
            this.Child.Y += this.BorderThickness.Top;
        }

        public override void UpdateInput(GraphicalUserInterface ui, GameTime gameTime)
        {
            base.UpdateInput(ui, gameTime);

            this.WasClicked = this.IsMouseOver && ui.InputState.IsLeftMouseClick;
        }
    }
}