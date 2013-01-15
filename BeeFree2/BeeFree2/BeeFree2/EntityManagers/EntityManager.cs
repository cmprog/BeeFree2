using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using TccLib.Xna.GameStateManagement;
using BeeFree2.GameEntities;

namespace BeeFree2.EntityManagers
{
    abstract class EntityManager
    {
        protected Vector2 ScreenSize { get; private set; }
        protected ContentManager ContentManager { get; private set; }

        public virtual void Activate(Game game)
        {
            var lViewport = game.GraphicsDevice.Viewport;
            this.ScreenSize = new Vector2(lViewport.Width, lViewport.Height);

            this.ContentManager = new ContentManager(game.Content.ServiceProvider);
            this.ContentManager.RootDirectory = "content";
        }

        public virtual void Unload()
        {
            this.ContentManager.Unload();
        }
    }
}
