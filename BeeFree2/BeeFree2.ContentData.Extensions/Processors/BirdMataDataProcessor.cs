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
    /// to apply custom processing to content data, converting an object of
    /// type TInput to TOutput. The input and output types may be the same if
    /// the processor wishes to alter data without changing its type.
    ///
    /// This should be part of a Content Pipeline Extension Library project.
    ///
    /// TODO: change the ContentProcessor attribute to specify the correct
    /// display name for this processor.
    /// </summary>
    [ContentProcessor(DisplayName = "BeeFree2 - Bird Meta Data Processor")]
    public class BirdMataDataProcessor : ContentProcessor<XDocument, IEnumerable<BirdMetaData>>
    {
        public override IEnumerable<BirdMetaData> Process(XDocument documents, ContentProcessorContext context)
        {
            var lCollection = new List<BirdMetaData>();

            foreach (var lBirdElement in documents.Element("BirdTypes").Elements("Bird"))
            {
                var lBirdMetaData = new BirdMetaData();
                lCollection.Add(lBirdMetaData);

                lBirdMetaData.ID = int.Parse(lBirdElement.Element("ID").Value);
                lBirdMetaData.Name = lBirdElement.Element("Name").Value;
                lBirdMetaData.Description = lBirdElement.Element("Description").Value;
                lBirdMetaData.HeadColor = ToColor(lBirdElement.Element("HeadColor"));
                lBirdMetaData.BodyColor = ToColor(lBirdElement.Element("BodyColor"));
                lBirdMetaData.Health = int.Parse(lBirdElement.Element("Health").Value);
                lBirdMetaData.TouchDamage = int.Parse(lBirdElement.Element("TouchDamage").Value);

                lBirdMetaData.ShootingBehaviorType = lBirdElement.Element("ShootingBehavior").Attribute("Type").Value;
                lBirdMetaData.ShootingBehaviorProperties = lBirdElement.Element("ShootingBehavior").Elements().ToDictionary(x => x.Name.LocalName, x => x.Value);

                lBirdMetaData.MovementBehaviorType = lBirdElement.Element("MovementBehavior").Attribute("Type").Value;
                lBirdMetaData.MovementBehaviorProperties = lBirdElement.Element("MovementBehavior").Elements().ToDictionary(x => x.Name.LocalName, x => x.Value);
            }

            return lCollection;
        }

        private Color ToColor(XElement element)
        {
            return new Color(
                int.Parse(element.Attribute("R").Value),
                int.Parse(element.Attribute("G").Value),
                int.Parse(element.Attribute("B").Value),
                int.Parse(element.Attribute("A").Value));
        }
    }
}