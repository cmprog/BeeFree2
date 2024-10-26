using System;
using Microsoft.Xna.Framework;

namespace BeeFree2.GameEntities
{
    /// <summary>
    /// Defines an interface for any entity which does damage on contact with a IKillableEntity
    /// </summary>
    public interface IDamagingEntity
    {
        /// <summary>
        /// Gets or sets the position of the entity.
        /// </summary>
        Vector2 Position { get; }

        /// <summary>
        /// Gets or sets the size of the entity.
        /// </summary>
        Vector2 Size { get; }

        /// <summary>
        /// Gets the amount of damage performed by this entity.
        /// </summary>
        float Damage { get; }

        /// <summary>
        /// Gets a flag indicating that this entity should be removed once
        /// it has performed damage to another entity.
        /// </summary>
        bool ShouldRemoveAfterPerformingDamage { get; }
    }
}
