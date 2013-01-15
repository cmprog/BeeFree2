using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BeeFree2.GameEntities
{
    /// <summary>
    /// Defines an interface for an entity which can be killed/destroyed.
    /// </summary>
    internal interface IKillableEntity<T>
    {
        /// <summary>
        /// Gets the maximum health of the entity.
        /// </summary>
        float MaximumHealth { get; }

        /// <summary>
        /// Gets the current health of the entity.
        /// </summary>
        float CurrentHealth { get; }

        /// <summary>
        /// Instructs the entity to take the given amount of damage.
        /// </summary>
        /// <param name="damge">The amount of damage to take.</param>
        void TakeDamage(IDamagingEntity damagingEntity);

        /// <summary>
        /// Called when the entity has been killed.
        /// </summary>
        event Action<T> OnDeath;
    }
}
