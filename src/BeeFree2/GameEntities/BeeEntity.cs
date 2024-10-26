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
    public class BeeEntity : IShootingEntity, IKillableEntity<BeeEntity>, IRenderableEntity, IMovableEntity
    {
        public IShootingBehavior ShootingBehavior { get; set; }

        public Vector2 Orientation
        {
            get { return this.MovementBehavior.Velocity; }
        }

        public bool HasTakenDamage { get; private set; }

        public float MaximumHealth { get; set; }
        public float CurrentHealth { get; set; }
        public float HealthRegen { get; set; }

        public void TakeDamage(IDamagingEntity entity)
        {
            this.HasTakenDamage = true;
            this.CurrentHealth -= entity.Damage;
            if (this.CurrentHealth <= 0) this.OnDeath(this);
        }

        public event Action<BeeEntity> OnDeath;

        /// <summary>
        /// Gets the hit radius to use for collusion detection.
        /// </summary>
        public float HitRadius { get { return 8; } }

        /// <summary>
        /// Gets or sets a flag indicating whether or not the bullet is friendly.
        /// </summary>
        public bool IsFriendly
        {
            get { return true; }
        }

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
