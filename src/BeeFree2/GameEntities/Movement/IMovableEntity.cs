using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Xna.Framework;

namespace BeeFree2.GameEntities.Movement
{
    /// <summary>
    /// Defines an interface for an entity which can be moved.
    /// </summary>
    public interface IMovableEntity
    {
        /// <summary>
        /// Gets or sets the movement behavior of this entity.
        /// </summary>
        IMovementBehavior MovementBehavior { get; set; }

        /// <summary>
        /// Gets the size of the entity.
        /// </summary>
        Vector2 Size { get; }
    }
}
