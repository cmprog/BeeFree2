using System;
using Microsoft.Xna.Framework;

namespace BeeFree2.GameEntities.Shooting
{
    /// <summary>
    /// Defines an interface for an entity which can shoot things.
    /// </summary>
    public interface IShootingEntity
    {
        /// <summary>
        /// Gets or sets the shooting behavior of the entity.
        /// </summary>
        IShootingBehavior ShootingBehavior { get; set; }

        /// <summary>
        /// Gets the position of the entity.
        /// </summary>
        Vector2 Position { get; }

        /// <summary>
        /// Gets the size of the entity.
        /// </summary>
        Vector2 Size { get; }

        /// <summary>
        /// Gets the orientation of the entity.
        /// </summary>
        Vector2 Orientation { get; }

        /// <summary>
        /// Gets a flag indicating whether or not the bullet is friendly.
        /// </summary>
        bool IsFriendly { get; }
    }
}
