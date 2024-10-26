using BeeFree2.ContentData;
using Microsoft.Xna.Framework;
using System.IO;
using YamlDotNet.Serialization;

namespace BeeFree2.Config
{
    public sealed class ConfigurationManager
    {
        private readonly IDeserializer mDeserializer;
        private const string sFileExtension = ".yaml";

        public ConfigurationManager()
        {
            mDeserializer = new DeserializerBuilder()
                .WithTypeConverter(new Vector2TypeConverter())
                .WithTypeConverter(new ColorTypeConverter())
                .Build();
        }

        public ShopData LoadShopData()
        {
            using var lFileStream = TitleContainer.OpenStream($"Configs/shop{sFileExtension}");
            using var lStreamReader = new StreamReader(lFileStream);
            return mDeserializer.Deserialize<ShopData>(lStreamReader);
        }

        public BirdTemplateCollection LoadBirdTemplateRepo()
        {
            using var lFileStream = TitleContainer.OpenStream($"Configs/bird-templates{sFileExtension}");
            using var lStreamReader = new StreamReader(lFileStream);
            return mDeserializer.Deserialize<BirdTemplateCollection>(lStreamReader);
        }

        public LevelData LoadLevelData(int levelId)
        {
            using var lFileStream = TitleContainer.OpenStream($"Configs/Levels/level_{levelId:00}{sFileExtension}");
            using var lStreamReader = new StreamReader(lFileStream);
            return mDeserializer.Deserialize<LevelData>(lStreamReader);
        }
    }
}
