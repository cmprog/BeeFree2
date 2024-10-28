using Microsoft.Xna.Framework;

namespace BeeFree2.ContentData
{

    /// <summary>
    /// Contains information about a bird in order to create the bird at run-time.
    /// </summary>
    public sealed class BirdTemplate
    {
        /// <summary>
        /// Gets or sets a unique ID for the bird.
        /// </summary>
        public int ID { get; set; }

        /// <summary>
        /// Gets or sets a name for the bird.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets a description for the bird.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the type of the shooting behavior.
        /// </summary>
        public ShootingBehaviorTemplate ShootingBehavior { get; set; }

        /// <summary>
        /// Gets or sets the type of the movement behavior.
        /// </summary>
        public MovementBehaviorTemplate MovementBehavior { get; set; }

        /// <summary>
        /// Gets or sets the body color.
        /// </summary>
        public Color BodyColor { get; set; }

        /// <summary>
        /// Gets or sets the head color.
        /// </summary>
        public Color HeadColor { get; set; }
        
        /// <summary>
        /// Gets or sets the health of the bird.
        /// </summary>
        public int Health { get; set; }

        /// <summary>
        /// Gets or sets the amount of damage done when touching the bird.
        /// </summary>
        public int TouchDamage { get; set; }
    }
}
