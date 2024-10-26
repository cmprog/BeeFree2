using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BeeFree2.ContentData
{
    /// <summary>
    /// Price data is based per level of the item.
    /// </summary>
    public class PriceData
    {
        /// <summary>
        /// Gets or sets the UpgradeID associated with this Price.
        /// </summary>
        public int UpgradeID { get; set; }

        /// <summary>
        /// Gets or sets the texture path for this the item at this price.
        /// </summary>
        public string TexturePath { get; set; }

        /// <summary>
        /// Gets or sets the price of this item.
        /// </summary>
        public int Price { get; set; }

        /// <summary>
        /// Gets or sets the level this price if for.
        /// </summary>
        public int Level { get; set; }

        /// <summary>
        /// Gets or sets the description for the item at this price.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Returns a flag indicating whether this value is equal to the other value.
        /// </summary>
        /// <param name="obj">The other value to compare against.</param>
        /// <returns>True if they are the same, false otherwise.</returns>
        public override bool Equals(object obj)
        {
            return ReferenceEquals(this, obj);
        }

        /// <summary>
        /// Gets a simple hashcode for us.
        /// </summary>
        /// <returns>The generated hashcode.</returns>
        public override int GetHashCode()
        {
            return this.UpgradeID ^ this.Level;
        }
    }
}
