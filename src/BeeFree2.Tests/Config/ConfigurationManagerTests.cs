namespace BeeFree2.Config
{
    [TestClass]
    public sealed class ConfigurationManagerTests
    {
        [TestMethod]
        [DataRow(0)]
        public void LoadLevelData(int levelId)
        {
            var lConfigurationManager = new ConfigurationManager();
            var lLevelData = lConfigurationManager.LoadLevelData(levelId);
            Assert.IsNotNull(lLevelData);
        }

        [TestMethod]
        public void LoadBirdTemplateRepo()
        {
            var lConfigurationManager = new ConfigurationManager();
            var lRepo = lConfigurationManager.LoadBirdTemplateRepo();

            Assert.IsNotNull(lRepo);
            Assert.IsTrue(lRepo.Count > 0);
        }
    }
}