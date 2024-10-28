using BeeFree2.GameEntities;
using System;
using System.IO;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace BeeFree2
{
    /// <summary>
    /// Responsible for saving and loading game saves.
    /// </summary>
    public sealed class GamePersistanceService
    {
        private readonly string mBaseDirectoryPath;
        private readonly JsonSerializerOptions mOptions;

        public GamePersistanceService()
        {
            var lApplicationDataDirectoryPath = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);            
            var lBeeFreeDirectoryPath = Path.Combine(lApplicationDataDirectoryPath, "MorseCoding", "BeeFree2", "Saves");

            if (!Directory.Exists(lBeeFreeDirectoryPath))
            {
                Directory.CreateDirectory(lBeeFreeDirectoryPath);
            }

            this.mBaseDirectoryPath = lBeeFreeDirectoryPath;

            this.mOptions = new JsonSerializerOptions();
            this.mOptions.WriteIndented = true;
            this.mOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingDefault;
        }

        /// <summary>
        /// Saves the player to the given slot.
        /// </summary>
        public void Save(SaveSlot saveSlot, Player player)
        {
            if (player == null) throw new ArgumentNullException(nameof(player));

            var lFilePath = this.GetFilePath(saveSlot);
            var lSerializedPlayerData = JsonSerializer.Serialize(player, this.mOptions);
            File.WriteAllText(lFilePath, lSerializedPlayerData);
        }

        /// <summary>
        /// Checks if there is a player saved in the given slot.
        /// </summary>
        public bool Exists(SaveSlot saveSlot) => this.TryLoad(saveSlot, out _);

        /// <summary>
        /// Tries to load the player from the given slot.
        /// </summary>
        public bool TryLoad(SaveSlot saveSlot, out Player player)
        {
            var lFilePath = this.GetFilePath(saveSlot);
            
            try
            {
                var lSerializedPlayerData = File.ReadAllText(lFilePath);
                player = JsonSerializer.Deserialize<Player>(lSerializedPlayerData, this.mOptions);

                return true;
            }
            catch (IOException)
            {
                player = default;
                return false;
            }
        }

        private string GetFilePath(SaveSlot saveSlot) => Path.Combine(this.mBaseDirectoryPath, $"player_{saveSlot}.json");
    }
}
