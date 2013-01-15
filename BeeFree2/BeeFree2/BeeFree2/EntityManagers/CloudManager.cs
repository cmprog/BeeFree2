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
using BeeFree2.GameEntities.Movement;
using BeeFree2.GameEntities.Rendering;

namespace BeeFree2.EntityManagers
{
    class CloudManager : EntityManager
    {
        private Texture2D[] Textures { get; set; }
        private LinkedList<SimpleGameEntity> Clouds { get; set; }

        private Random Random { get; set; }
        private int NewCloudTimer { get; set; }

        public CloudManager()
        {
            this.Clouds = new LinkedList<SimpleGameEntity>();
            this.Random = new Random();
        }

        public override void Activate(Game game)
        {
            base.Activate(game);

            this.Textures = new[]
            {
                this.ContentManager.Load<Texture2D>("sprites/cloud1"),
                this.ContentManager.Load<Texture2D>("sprites/cloud2"),
                this.ContentManager.Load<Texture2D>("sprites/cloud3"),
            };

            // We'll create a small handful of clouds to initially populate the screen
            foreach (var lIndex in Enumerable.Range(3, this.Random.Next(5))) this.AddCloud();
            foreach (var lCloud in this.Clouds)
            {
                lCloud.MovementBehavior.Position = new Vector2(
                    this.Random.Next((int)this.ScreenSize.X), 
                    lCloud.MovementBehavior.Position.Y);
            }
        }

        private void AddCloud()
        {
            var lTexture = this.Textures[this.Random.Next(this.Textures.Length)];
            var lSize = new Vector2(lTexture.Width, lTexture.Height);
            var lSpeed = this.Random.Next(50, 200);
            var lScale = MathHelper.Lerp(0.2f, 1.0f, (float)Math.Pow((lSpeed - 50) / 200f, 2));

            var lCloud = new SimpleGameEntity
            {
                Renderer = new BasicRenderer(lTexture, lScale),
                MovementBehavior = new StraightMovementBehavior
                {
                    Position = new Vector2(this.ScreenSize.X, this.Random.Next((int)-lSize.Y, (int)(this.ScreenSize.Y + lSize.Y))),
                    Velocity = Vector2.UnitX * -lSpeed,
                    Acceleration = Vector2.Zero,
                },
            };

            this.Add(lCloud);
        }

        private void Add(SimpleGameEntity cloud)
        {
            var lCurrentNode = this.Clouds.First;
            while ((lCurrentNode != null) && (lCurrentNode.Value.MovementBehavior.Velocity.X > cloud.MovementBehavior.Velocity.X)) lCurrentNode = lCurrentNode.Next;

            if (lCurrentNode == null) this.Clouds.AddLast(cloud);
            else this.Clouds.AddBefore(lCurrentNode, cloud);
        }

        public void Update(GameTime gameTime)
        {
            if (this.NewCloudTimer == 0)
            {
                this.NewCloudTimer = this.Random.Next(10, 80);
                this.AddCloud();
            }
            this.NewCloudTimer--;

            using (var lOldClouds = new BatchCollectionRemover<SimpleGameEntity>(this.Clouds))
            {
                foreach (var lCloud in this.Clouds)
                {
                    lCloud.MovementBehavior.Move(lCloud, gameTime);
                    if (lCloud.Position.X < -lCloud.Size.X)
                    {
                        lOldClouds.Add(lCloud);
                    }
                }
            }
        }

        public void Draw(SpriteBatch spriteBatch, GameTime gameTime)
        {
            foreach (var lCloud in this.Clouds)
            {
                lCloud.Renderer.Render(lCloud, spriteBatch, gameTime);
            }
        }
    }
}
