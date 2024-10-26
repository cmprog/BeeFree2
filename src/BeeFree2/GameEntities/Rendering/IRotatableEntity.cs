using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BeeFree2.GameEntities.Rendering
{
    /// <summary>
    /// Defines an interface for an entity which is rotatable.
    /// </summary>
    public interface IRotatableEntity
    {
        /// <summary>
        /// Gets the rotation amount of the entity.
        /// </summary>
        float Rotation { get; }
    }
}
