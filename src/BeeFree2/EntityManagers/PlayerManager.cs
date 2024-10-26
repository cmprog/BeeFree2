using System;
using System.IO;
using System.Xml.Serialization;
using Microsoft.Xna.Framework;
using BeeFree2.GameEntities;
namespace BeeFree2.EntityManagers
{
    class PlayerManager : EntityManager
    {
        /// <summary>
        /// Gets or sets the name of the save file.
        /// </summary>
        private string FileName { get; set; }

        /// <summary>
        /// Gets the Player associated with the game.
        /// </summary>
        public Player Player { get; private set; }

        /// <summary>
        /// Gets whether or not a saved game exists.
        /// </summary>
        public bool SaveGameExists { get; private set; }

        public PlayerManager()
        {
            this.FileName = "BeeFree.bee";
        }

        private string GetSaveFilePath()
        {
            var lApplicationDataDirectoryPath = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            var lBeeFreeDirectoryPath = Path.Combine(lApplicationDataDirectoryPath, "BeeFree2");
            if (!Directory.Exists(lBeeFreeDirectoryPath))
            {
                Directory.CreateDirectory(lBeeFreeDirectoryPath);
            }

            var lFilePath = Path.Combine(lBeeFreeDirectoryPath, this.FileName);
            return lFilePath;
        }

        public void CreateNewPlayer()
        {
            this.Player = new Player();
            this.Player.LevelStats[0].IsAvailable = true;
        }

        public override void Activate(Game game)
        {
            var lFilePath = this.GetSaveFilePath();
            this.SaveGameExists = File.Exists(lFilePath);

            if (this.SaveGameExists)
            {
                using (var lTextReader = new StreamReader(lFilePath))
                {
                    var lSerializer = new XmlSerializer(typeof(Player));
                    this.Player = (Player)lSerializer.Deserialize(lTextReader);
                }
            }
        }

        public override void Unload()
        {
            var lFilePath = this.GetSaveFilePath();
            using (var lTextWriter = new StreamWriter(lFilePath))
            {
                var lSerializer = new XmlSerializer(typeof(Player));
                lSerializer.Serialize(lTextWriter, this.Player);
            }
        }
    }
}
