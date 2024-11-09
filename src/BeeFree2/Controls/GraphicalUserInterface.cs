using BeeFree2.GameScreens;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using System;
using System.Collections.Generic;

namespace BeeFree2.Controls
{
    public sealed class GraphicalUserInterface : GraphicsContainer
    {
        private readonly Stack<(Rectangle, bool)> mScissorStack = new();
        private bool mIsInSpriteBatch;

        private Texture2D mPixelTexture;
        private Dictionary<byte, Texture2D> mAlphaPixelTextureCache = new();

        public GraphicalUserInterface(GameScreen gameScreen)
            : this(gameScreen.ScreenManager)
        {

        }

        public GraphicalUserInterface(ScreenManager screenManager)
            : this(screenManager.SpriteBatch, screenManager.InputState)
        {

        }

        public GraphicalUserInterface(SpriteBatch spriteBatch, InputState inputState)
        {
            this.SpriteBatch = spriteBatch;
            this.SpriteBatch.Disposing += this.OnSpriteBatchDisposing;

            this.mPixelTexture = new Texture2D(spriteBatch.GraphicsDevice, 1, 1, mipmap: false, SurfaceFormat.Color);
            this.mPixelTexture.SetData(new[] { Color.White });

            this.InputState = inputState;
        }

        private void OnSpriteBatchDisposing(object sender, EventArgs e)
        {
            this.mPixelTexture.Dispose();
            this.mPixelTexture = null;
        }

        public SpriteBatch SpriteBatch { get; }

        public InputState InputState { get; }

        public void PushScissorClip(RectangleF clip)
        {
            var lIsInSpriteBatch = this.mIsInSpriteBatch;
            if (lIsInSpriteBatch)
            {
                this.EndSpriteBatchScope();
            }

            var lIntClip = new Rectangle();
            lIntClip.X = (int) clip.X;
            lIntClip.Y = (int) clip.Y;

            // Add 1 to prevent truncating the size
            lIntClip.Width = (int) (clip.Width + 1);
            lIntClip.Height = (int) (clip.Height + 1);


            this.mScissorStack.Push((this.SpriteBatch.GraphicsDevice.ScissorRectangle, lIsInSpriteBatch));
            this.SpriteBatch.GraphicsDevice.ScissorRectangle = lIntClip;
            this.BeginSpriteBatch();
        }

        public void PopScissorClip()
        {
            if (this.mIsInSpriteBatch)
            {
                this.EndSpriteBatchScope();
            }

            (this.SpriteBatch.GraphicsDevice.ScissorRectangle, this.mIsInSpriteBatch) = this.mScissorStack.Pop();

            if (this.mIsInSpriteBatch)
            {
                this.BeginSpriteBatch();
            }
        }

        public void BeginSpriteBatch()
        {
            this.SpriteBatch.Begin();
            this.mIsInSpriteBatch = true;
        }

        private void EndSpriteBatchScope()
        {
            this.SpriteBatch.End();
            this.mIsInSpriteBatch = false;
        }

        public void Update(GameTime gameTime, bool callUpdateInput)
        {
            this.UpdateInitialize(gameTime);

            if (callUpdateInput)
            {
                this.UpdateInput(this, gameTime);
            }
            
            this.UpdateFinalize(gameTime);
            this.LayoutChildren(gameTime);
        }

        public override Vector2 MeasureCore(GameTime gameTime)
        {
            return new Vector2(
                this.SpriteBatch.GraphicsDevice.PresentationParameters.BackBufferWidth,
                this.SpriteBatch.GraphicsDevice.PresentationParameters.BackBufferHeight);
        }

        public override void LayoutChildren(GameTime gameTime)
        {
            // The root UI gets to manage its own position and size

            this.X = 0;
            this.Y = 0;
            this.Measure(gameTime);

            this.ActualWidth = this.DesiredWidth;
            this.ActualHeight = this.DesiredHeight;

            if (this.Child != null)
            {
                this.Child.Measure(gameTime);
                this.Child.ApplyAlignment(this.Bounds);

                if (this.Child is IGraphicsContainer lContainer)
                {
                    lContainer.LayoutChildren(gameTime);
                }
            }
        }

        public void Draw(GameTime gameTime) => this.Draw(this, gameTime);

        public void FillRectangle(RectangleF bounds, Color color)
        {
            if (color.A == byte.MaxValue)
            {
                this.SpriteBatch.Draw(this.mPixelTexture, bounds.Position, null, color, 0f, Vector2.Zero, bounds.Size, SpriteEffects.None, 0);
            }
            else
            {
                var lTexture = this.GetAlphaTexture(color.A);
                this.SpriteBatch.Draw(lTexture, bounds.Position, null, color, 0f, Vector2.Zero, bounds.Size, SpriteEffects.None, 0);
            }
        }

        private Texture2D GetAlphaTexture(byte alpha)
        {
            if (!this.mAlphaPixelTextureCache.TryGetValue(alpha, out var lTexture))
            {
                lTexture = new Texture2D(this.SpriteBatch.GraphicsDevice, 1, 1, mipmap: false, SurfaceFormat.Color);                
                lTexture.SetData(new[] { Color.FromNonPremultiplied(byte.MaxValue, byte.MaxValue, byte.MaxValue, alpha) });
            }

            return lTexture;
        }

        public void DrawRectangle(RectangleF rect, Color color, ThicknessF thickness)
        {
            var lTopLeft = rect.TopLeft;

            var lTopRight = rect.TopRight;
            lTopRight.X -= thickness.Right;

            var lBottomLeft = rect.BottomLeft;
            lBottomLeft.Y -= thickness.Bottom;

            var lScaleTop = new Vector2(rect.Width, thickness.Top);
            this.SpriteBatch.Draw(this.mPixelTexture, lTopLeft, null, color, 0, Vector2.Zero, lScaleTop, SpriteEffects.None, 0);

            var lScaleBottom = new Vector2(rect.Width, thickness.Bottom);
            this.SpriteBatch.Draw(this.mPixelTexture, lBottomLeft, null, color, 0, Vector2.Zero, lScaleBottom, SpriteEffects.None, 0);

            var lScaleLeft = new Vector2(thickness.Left, rect.Height);
            this.SpriteBatch.Draw(this.mPixelTexture, lTopLeft, null, color, 0, Vector2.Zero, lScaleLeft, SpriteEffects.None, 0);

            var lScaleRight = new Vector2(thickness.Right, rect.Height);
            this.SpriteBatch.Draw(this.mPixelTexture, lTopRight, null, color, 0, Vector2.Zero, lScaleRight, SpriteEffects.None, 0);
        }
    }
}
