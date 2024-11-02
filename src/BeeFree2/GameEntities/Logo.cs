using BeeFree2.Controls;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;

namespace BeeFree2.GameEntities
{
    public sealed class Logo : GraphicsContainer
    {
        public Logo(ContentManager contentManager) 
        {   
            var lTextBlock_Bee = new TextBlock("Bee", contentManager.Load<SpriteFont>(AssetNames.Fonts.Logo_96));
            lTextBlock_Bee.HorizontalAlignment = HorizontalAlignment.Left;
            lTextBlock_Bee.VerticalAlignment = VerticalAlignment.Top;
            lTextBlock_Bee.Margin = new Thickness(50, 0, 0, 0);

            var lTextBlock_Free = new TextBlock("Free", contentManager.Load<SpriteFont>(AssetNames.Fonts.Logo_96));
            lTextBlock_Free.HorizontalAlignment = HorizontalAlignment.Left;
            lTextBlock_Free.VerticalAlignment = VerticalAlignment.Top;
            lTextBlock_Free.Margin = new Thickness(0, 100, 0, 0);

            var lTextBlock_2 = new TextBlock("2", contentManager.Load<SpriteFont>(AssetNames.Fonts.Logo_128));            

            var lGrid = new Grid();
            lGrid.Add(lTextBlock_Bee);
            lGrid.Add(lTextBlock_Free);

            var lDockPanel = new DockPanel();
            lDockPanel.Add(lTextBlock_2, Dock.Right);
            lDockPanel.Add(lGrid);

            this.Add(lDockPanel);
        }

        public override void LayoutChildren(GameTime gameTime)
        {
            base.LayoutChildren(gameTime);
        }
    }
}
