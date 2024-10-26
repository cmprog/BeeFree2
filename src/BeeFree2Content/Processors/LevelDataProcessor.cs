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
    [ContentProcessor(DisplayName = "BeeFree2 - Level Data Processor")]
    public class LevelDataProcessor : ContentProcessor<XDocument, LevelData>
    {
        public override LevelData Process(XDocument document, ContentProcessorContext context)
        {
            var lLevelData = new LevelData();

            var lLevelElement = document.Element("Level");
            lLevelData.Name = lLevelElement.Element("Name").Value;
            lLevelData.StartTime = TimeSpan.Parse(lLevelElement.Element("StartTime").Value);
            lLevelData.EndTime = TimeSpan.Parse(lLevelElement.Element("EndTime").Value);

            var lBirdDataList = new List<BirdData>();

            foreach (var lBirdElement in lLevelElement.Elements("Bird"))
            {
                lBirdDataList.Add(new BirdData
                {
                    Type = int.Parse(lBirdElement.Element("Type").Value),
                    ReleaseTime = TimeSpan.Parse(lBirdElement.Element("ReleaseTime").Value),
                    Position = ParseVector(lBirdElement.Element("Position")),
                });                
            }

            lLevelData.BirdData = lBirdDataList.ToArray();

            return lLevelData;
        }

        /// <summary>
        /// Parses a Vector2 out of the element.
        /// </summary>
        /// <param name="element">The XElement to parse.</param>
        /// <returns>The parsed Vector2</returns>
        private Vector2 ParseVector(XElement element)
        {
            return new Vector2(
                float.Parse(element.Attribute("x").Value),
                float.Parse(element.Attribute("y").Value));
        }
    }
}