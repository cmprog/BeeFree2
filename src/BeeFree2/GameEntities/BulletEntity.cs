using Microsoft.Xna.Framework;
using BeeFree2.GameEntities.Movement;
using BeeFree2.GameEntities.Rendering;

namespace BeeFree2.GameEntities
{
    /// <summary>
    /// Bullets are a special type of entity in that they can be killed and be damaged.
    /// </summary>
    public class BulletEntity : IMovableEntity, IDamagingEntity, IRenderableEntity
    {
        /// <summary>
        /// Gets or sets a flag indicating whether the bullet originated from
        /// the bee or an enemy.
        /// </summary>
        public bool IsFriendly { get; set; }

        /// <summary>
        /// The amount of damage done by the bullet.
        /// </summary>
        public float Damage { get; set; }

        /// <summary>
        /// Bullets are always removed when they perform damage.
        /// </summary>
        public bool ShouldRemoveAfterPerformingDamage
        {
            get { return true; }
        }

        /// <summary>
        /// Gets a vector describing the orientation of the entity.
        /// </summary>
        public Vector2 Orientation { get { return this.MovementBehavior.Velocity; } }

        /// <summary>
        /// Gets the size of the entity.
        /// </summary>
        public Vector2 Size { get { return this.Renderer.Size; } }

        /// <summary>
        /// Gets the position of the entity.
        /// </summary>
        public Vector2 Position { get { return this.MovementBehavior.Position; } }

        /// <summary>
        /// Gets the renderer responsible for painting this entity.
        /// </summary>
        public IRenderer Renderer { get; set; }

        /// <summary>
        /// Gets the movement behavior responsible for moving this entity.
        /// </summary>
        public IMovementBehavior MovementBehavior { get; set; }
    }
}
