using Microsoft.Xna.Framework;

namespace BeeFree2.Controls
{
    public interface IGraphicsContainer : IGraphicsComponent
    {
        void Add(IGraphicsComponent child);

        void Remove(IGraphicsComponent child);

        void LayoutChildren(GameTime gameTime);

        IGraphicsComponent GetPreviousComponent(IGraphicsComponent child);

        IGraphicsComponent GetNextComponent(IGraphicsComponent child);
    }
}
