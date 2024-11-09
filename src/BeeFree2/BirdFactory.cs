using BeeFree2.GameEntities;
using BeeFree2.GameEntities.Rendering;
using BeeFree2.ContentData;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Content;
using BeeFree2.Config;
using BeeFree2.EntityManagers;

namespace BeeFree2
{
    /// <summary>
    /// Factory class to create birds.
    /// </summary>
    public sealed class BirdFactory
    {
        private readonly IGameplayController mGameplayController;

        /// <summary>
        /// Gets the content manager used by the factory.
        /// </summary>
        public ContentManager ContentManager { get; private set; }

        public ConfigurationManager ConfigurationManager { get; private set; }

        /// <summary>
        /// Gets or sets the meta data associated with birds.
        /// </summary>
        private BirdTemplateCollection BirdTemplates { get; set; }

        /// <summary>
        /// Creates a new bird factory used to create bird entities.
        /// </summary>
        /// <param name="manager"></param>
        public BirdFactory(IGameplayController gameplayController)
        {
            this.mGameplayController = gameplayController;

            this.ContentManager = gameplayController.Game.Content;
            this.ConfigurationManager = gameplayController.Game.Services.GetService<ConfigurationManager>();
        }

        private Texture2D TextureBody { get; set; }
        private Texture2D TextureEyelids { get; set; }
        private Texture2D TextureFace { get; set; }
        private Texture2D TextureHead { get; set; }
        private Texture2D TextureLegs { get; set; }

        /// <summary>
        /// Creates a new bird using the given bird data.
        /// </summary>
        /// <param name="initializationData">The variable information associated with bird starting position and time.</param>
        /// <returns>The new bird entity.</returns>
        public BirdEntity CreateBird(BirdInitializationData initializationData)
        {
            if (this.BirdTemplates == null)
            {
                this.Initialize();
            }

            var lBirdTemplate = this.BirdTemplates[initializationData.Type];

            return new BirdEntity
            {
                MovementBehavior = lBirdTemplate.MovementBehavior.CreateBehavior(initializationData),
                Renderer = this.CreateBirdRenderer(lBirdTemplate),
                ShootingBehavior = lBirdTemplate.ShootingBehavior.CreateBehavior(),
                MaximumHealth = lBirdTemplate.Health,
                CurrentHealth = lBirdTemplate.Health,
                ReleaseTime = initializationData.ReleaseTime,
                Damage = lBirdTemplate.TouchDamage,
            };
        }

        /// <summary>
        /// Initializes our meta data.
        /// </summary>
        private void Initialize()
        {
            this.BirdTemplates = this.ConfigurationManager.LoadBirdTemplateRepo();

            this.TextureBody = this.ContentManager.Load<Texture2D>("sprites/bird_body");
            this.TextureFace = this.ContentManager.Load<Texture2D>("sprites/bird_face");
            this.TextureLegs = this.ContentManager.Load<Texture2D>("sprites/bird_legs");
            this.TextureHead = this.ContentManager.Load<Texture2D>("sprites/bird_head");
            this.TextureEyelids = this.ContentManager.Load<Texture2D>("sprites/bird_eyelids");
        }

        private IRenderer CreateBirdRenderer(BirdTemplate template)
        {
            return new CompositeRenderer(
                new[] 
                {
                    new CompositeRendererItem(this.TextureLegs, new Vector2(17, 36)),
                    new CompositeRendererItem(this.TextureBody, new Vector2(9, 0), template.BodyColor),
                    new CompositeRendererItem(this.TextureHead, new Vector2(5, 10), template.HeadColor),
                    new CompositeRendererItem(this.TextureFace, new Vector2(0, 15)),
                    new CompositeRendererItem(this.TextureEyelids, new Vector2(17, 39), template.BodyColor),
                });
        }
    }
}
