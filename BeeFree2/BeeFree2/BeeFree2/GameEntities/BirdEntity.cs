using System;
using BeeFree2.GameEntities.Movement;
using BeeFree2.GameEntities.Shooting;
using BeeFree2.GameEntities.Rendering;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;

namespace BeeFree2.GameEntities
{
    public class BirdEntity : IShootingEntity, IKillableEntity<BirdEntity>, IDamagingEntity, IRenderableEntity, IMovableEntity
    {
        public IShootingBehavior ShootingBehavior { get; set; }

        public Vector2 Orientation
        {
            get { return this.MovementBehavior.Velocity; }
        }

        public float MaximumHealth { get; set; }

        public float CurrentHealth { get; set; }

        public void TakeDamage(IDamagingEntity entity)
        {
            this.CurrentHealth -= entity.Damage;

            if (this.CurrentHealth <= 0)
            {
                this.OnDeath(this);
            }
        }

        public event Action<BirdEntity> OnDeath;

        public float Damage { get; set; }

        public bool ShouldRemoveAfterPerformingDamage { get { return true; } }
        
        /// <summary>
        /// Gets or sets a flag indicating whether or not the bullet is friendly.
        /// </summary>
        public bool IsFriendly
        {
            get { return false; }
        }

        /// <summary>
        /// Gets or sets the time of release for this bird.
        /// </summary>
        public TimeSpan ReleaseTime { get; set; }
        
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
