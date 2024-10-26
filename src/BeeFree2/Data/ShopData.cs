using System.Collections.Generic;

namespace BeeFree2.ContentData
{
    /// <summary>
    /// The shop data contiains the information on the various upgrades.
    /// </summary>
    public class ShopData
    {
        /// <summary>
        /// Gets or sets the upgrade data contained by the shop.
        /// </summary>
        public IList<UpgradeData> Upgrades { get; set; }
    }
}
