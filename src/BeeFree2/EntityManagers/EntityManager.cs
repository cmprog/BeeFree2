using BeeFree2.Config;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;

namespace BeeFree2.EntityManagers
{
    abstract class EntityManager
    {
        protected Vector2 ScreenSize { get; private set; }
        protected ContentManager ContentManager { get; private set; }

        protected ConfigurationManager ConfigurationManager { get; private set; }

        public virtual void Activate(Game game)
        {
            var lViewport = game.GraphicsDevice.Viewport;
            this.ScreenSize = new Vector2(lViewport.Width, lViewport.Height);

            this.ContentManager = new ContentManager(game.Content.ServiceProvider);
            this.ContentManager.RootDirectory = "content";

            this.ConfigurationManager = game.Services.GetService<ConfigurationManager>();
        }

        public virtual void Unload()
        {
            this.ContentManager.Unload();
        }
    }
}
