using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Content.Pipeline;
using Microsoft.Xna.Framework.Content.Pipeline.Graphics;
using Microsoft.Xna.Framework.Content.Pipeline.Processors;
using BeeFree2.ContentData;

namespace BeeFree2.ContentData.Extensions.Processors
{
    /// <summary>
    /// This class will be instantiated by the XNA Framework Content Pipeline
    /// to import a file from disk into the specified type, TImport.
    /// 
    /// This should be part of a Content Pipeline Extension Library project.
    /// 
    /// TODO: change the ContentImporter attribute to specify the correct file
    /// extension, display name, and default processor for this importer.
    /// </summary>
    [ContentProcessor(DisplayName = "BeeFree2 - Shop Data Processor")]
    public class ShopDataProcessor : ContentProcessor<XDocument, ShopData>
    {
        public override ShopData Process(XDocument document, ContentProcessorContext context)
        {
            var lShopData = new ShopData();

            var lUpgradeDataList = new List<UpgradeData>();

            var lShopElement = document.Element("Shop");
            foreach (var lItemElement in lShopElement.Elements("Item"))
            {
                var lUpgradeData = new UpgradeData();

                lUpgradeData.ID = int.Parse(lItemElement.Element("ID").Value);
                lUpgradeData.Text = lItemElement.Element("Text").Value;

                var lPriceDataList = new List<PriceData>();
                foreach (var lPriceElement in lItemElement.Elements("PriceInfo"))
                {
                    var lPriceData = new PriceData();

                    lPriceData.UpgradeID = lUpgradeData.ID;
                    lPriceData.TexturePath = lPriceElement.Element("Texture").Value;
                    lPriceData.Price = int.Parse(lPriceElement.Element("Price").Value);
                    lPriceData.Level = int.Parse(lPriceElement.Element("Level").Value);
                    lPriceData.Description = lPriceElement.Element("Description").Value;

                    lPriceDataList.Add(lPriceData);
                }

                lUpgradeData.Prices = lPriceDataList.OrderBy(x => x.Level).ToArray();

                lUpgradeDataList.Add(lUpgradeData);
            }

            lShopData.Upgrades = lUpgradeDataList.OrderBy(x => x.ID).ToArray();

            return lShopData;
        }
    }
}
