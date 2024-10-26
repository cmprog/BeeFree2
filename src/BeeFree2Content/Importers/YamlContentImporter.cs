using Microsoft.Xna.Framework.Content.Pipeline;
using YamlDotNet.RepresentationModel;
using YamlDotNet.Serialization;

namespace BeeFree2.ContentData.Extensions.Importers
{
    [ContentImporter(".yaml", DisplayName = "BeeFree2 - YAML Data Importer")]
    public sealed class YamlContentImporter : ContentImporter<YamlDocument>
    {
        public override YamlDocument Import(string filename, ContentImporterContext context)
        {
            var lBuilder = new DeserializerBuilder();
            var lSerializer = lBuilder.Build();

            var lDocument = lSerializer.Deserialize<YamlDocument>(filename);

            return lDocument;
        }
    }
}
