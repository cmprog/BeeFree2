using System.Collections.Generic;

namespace BeeFree2.ContentData
{
    /// <summary>
    /// An upgrade is mostly defines by its prices, but we reference it by
    /// ID and we give it a name to make it feel wanted.
    /// </summary>
    public class UpgradeData
    {
        /// <summary>
        /// Gets the ID associated with this upgrade.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the text associated with this upgrade.
        /// </summary>
        public string Text { get; set; }

        /// <summary>
        /// Gets or sets the PriceDatas associated with this Upgrade.
        /// </summary>
        public IList<PriceData> Prices { get; set; }
    }
}
