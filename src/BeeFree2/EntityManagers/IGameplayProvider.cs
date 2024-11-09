using Microsoft.Xna.Framework;

namespace BeeFree2.EntityManagers
{
    /// <summary>
    /// Defines the interface for an object which the dynamically generated
    /// components of gameplay.
    /// </summary>
    public interface IGameplayProvider
    {
        void Update(GameTime gameTime);
    }
}
