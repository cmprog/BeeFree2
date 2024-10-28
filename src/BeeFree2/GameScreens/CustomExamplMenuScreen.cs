using BeeFree2.Controls;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace BeeFree2.GameScreens
{
    internal sealed class CustomExamplMenuScreen : GameScreen
    {
        private GraphicalUserInterface mUserInterface;

        private Button mButton;
        private TextBlock mTextBlock;
        private int mCounter;

        public override void Activate(bool instancePreserved)
        {
            base.Activate(instancePreserved);

            var lFont = this.ScreenManager.Game.Content.Load<SpriteFont>("Fonts/MainMenuFont");

            this.mUserInterface = new GraphicalUserInterface(this.ScreenManager.SpriteBatch, this.ScreenManager.InputState);

            this.mTextBlock = new TextBlock("Click Me", lFont);

            this.mButton = new Button();
            this.mButton.Add(this.mTextBlock);

            var lPanel = new VerticalStackPanel();
            lPanel.Add(new TextBlock("Hello", lFont));
            lPanel.Add(new TextBlock("World", lFont));
            lPanel.Add(this.mButton);

            this.mUserInterface.Add(lPanel);
        }

        public override void Update(GameTime gameTime, bool otherScreenHasFocus, bool coveredByOtherScreen)
        {
            base.Update(gameTime, otherScreenHasFocus, coveredByOtherScreen);
            this.mUserInterface.Update(gameTime, !otherScreenHasFocus && !coveredByOtherScreen);

            if (this.mButton.WasClicked)
            {
                this.mCounter++;
                this.mTextBlock.Text = $"Clicked {this.mCounter} times!";
            }
        }

        public override void Draw(GameTime gameTime)
        {
            this.ScreenManager.Game.GraphicsDevice.Clear(Color.White);          
            this.mUserInterface.Draw(gameTime);
            base.Draw(gameTime);
        }
    }
}
